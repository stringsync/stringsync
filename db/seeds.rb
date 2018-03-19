require File.join(Rails.root, "lib", "fixture_loader", "fixture_loader.rb")

def delete_all!
  [User, Tag, Notation, Video, Tagging].each do |model|
    model.delete_all
    puts "Deleted all #{model} records."
  end
end

def load_fixtures
  puts "Loading records from db/fixtures."
  FixtureLoader.new.seed!
end

if Rails.env.development? || Rails.env.test?
  delete_all!
  load_fixtures
else
  puts "Cannot run seeds in the #{Rails.env} enviroment."
end

puts "Done."
