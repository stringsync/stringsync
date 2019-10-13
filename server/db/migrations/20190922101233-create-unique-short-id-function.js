module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.sequelize.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";

      -- https://blog.andyet.com/2016/02/23/generating-shortids-in-postgres/
      -- Create a trigger function that takes no arguments.
      -- Trigger functions automatically have OLD, NEW records
      -- and TG_TABLE_NAME as well as others.
      CREATE OR REPLACE FUNCTION unique_short_id()
      RETURNS TRIGGER AS $$
      
      -- Declare the variables we'll be using.
      DECLARE
        key TEXT;
        qry TEXT;
        found TEXT;
      BEGIN
      
        -- generate the first part of a query as a string with safely
        -- escaped table name, using || to concat the parts
        qry := 'SELECT id FROM ' || quote_ident(TG_TABLE_NAME) || ' WHERE id=';
      
        -- This loop will probably only run once per call until we've generated
        -- millions of ids.
        LOOP
      
          -- Generate our string bytes and re-encode as a base64 string.
          key := encode(gen_random_bytes(6), 'base64');
      
          -- Base64 encoding contains 2 URL unsafe characters by default.
          -- The URL-safe version has these replacements.
          key := replace(key, '/', '_'); -- url safe replacement
          key := replace(key, '+', '-'); -- url safe replacement
      
          -- Concat the generated key (safely quoted) with the generated query
          -- and run it.
          -- SELECT id FROM "test" WHERE id='blahblah' INTO found
          -- Now "found" will be the duplicated id or NULL.
          EXECUTE qry || quote_literal(key) INTO found;
      
          -- Check to see if found is NULL.
          -- If we checked to see if found = NULL it would always be FALSE
          -- because (NULL = NULL) is always FALSE.
          IF found IS NULL THEN
      
            -- If we didn't find a collision then leave the LOOP.
            EXIT;
          END IF;
      
          -- We haven't EXITed yet, so return to the top of the LOOP
          -- and try again.
        END LOOP;
      
        -- NEW and OLD are available in TRIGGER PROCEDURES.
        -- NEW is the mutated row that will actually be INSERTed.
        -- We're replacing id, regardless of what it was before
        -- with our key variable.
        NEW.id = key;
      
        -- The RECORD returned here is what will actually be INSERTed,
        -- or what the next trigger will get if there is one.
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.sequelize.query(`
      DROP FUNCTION unique_short_id;
      DROP EXTENSION "pgcrypto";
    `);
  },
};
