import { Col, Row, Tag } from 'antd';
import { merge, truncate } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { $queries, NotationObject } from '../../../graphql';

const NUM_SUGGESTIONS = 10;

const Outer = styled.div`
  margin-top: 8px;
`;

const Centered = styled.div`
  text-align: center;
`;

const List = styled.ul`
  list-style: none;
  padding-left: 8px;
  padding-right: 8px;
`;

const ListItem = styled.li`
  padding-top: 8px;
  padding-bottom: 8px;
  margin-left: 8px;
  margin-right: 8px;
  border-bottom: 1px solid ${(props) => props.theme['@border-color']};

  :hover {
    opacity: 0.5;
  }
`;

const Thumbnail = styled.img`
  width: 100%;
`;

const TextOuter = styled.div`
  margin-left: 8px;
`;

const BlackText = styled.div`
  color: black;
`;

const MutedText = styled.div`
  color: ${(props) => props.theme['@muted']};
`;

const TagsOuter = styled.div`
  margin-top: 4px;
  margin-left: 8px;
`;

type SuggestedNotation = {
  id: string;
  artistName: string;
  songName: string;
  thumbnailUrl: string;
  tags: Array<{ id: string; name: string }>;
  transcriber: { username: string };
};

type SuggestedNotationsProps = {
  srcNotationId: string;
};

const NULL_SUGGESTED_NOTATION: SuggestedNotation = {
  id: '',
  artistName: '',
  songName: '',
  thumbnailUrl: '',
  tags: [],
  transcriber: {
    username: '',
  },
};

const toSuggestedNotation = (notation: NotationObject): SuggestedNotation =>
  merge({}, NULL_SUGGESTED_NOTATION, {
    id: notation.id,
    artistName: notation.artistName,
    songName: notation.songName,
    thumbnailUrl: notation.thumbnailUrl,
    tags: notation.tags,
    transcriber: {
      username: notation.transcriber.username,
    },
  });

export const SuggestedNotations: React.FC<SuggestedNotationsProps> = (props) => {
  const [suggestedNotations, setSuggestedNotations] = useState<SuggestedNotation[]>([]);
  const [errors, setErrors] = useState(new Array<string>());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setErrors([]);
    setIsLoading(true);
    setSuggestedNotations([]);
    (async () => {
      const { data, errors } = await $queries.suggestedNotations({ id: props.srcNotationId, limit: NUM_SUGGESTIONS });
      if (errors) {
        setErrors(errors.map((error) => error.message));
      } else if (!data?.suggestedNotations) {
        setErrors([`no notation suggestions found with id '${props.srcNotationId}'`]);
      } else {
        setSuggestedNotations(data.suggestedNotations.map(toSuggestedNotation));
      }
      setIsLoading(false);
    })();
  }, [props.srcNotationId]);

  const hasErrors = errors.length > 0;
  const hasSuggestedNotations = suggestedNotations.length > 0;

  const shouldShowNoSuggestionsFound = !isLoading && !hasErrors && !hasSuggestedNotations;
  const shouldShowErrors = !isLoading && hasErrors;
  const shouldShowSuggestedNotations = !isLoading && !hasErrors && hasSuggestedNotations;
  const shouldShowFallback =
    !isLoading && !shouldShowNoSuggestionsFound && !shouldShowErrors && !shouldShowSuggestedNotations;

  return (
    <Outer>
      {shouldShowNoSuggestionsFound && (
        <Centered>
          <h3>no suggestions found</h3>
          <Link to="/library">library</Link>
        </Centered>
      )}

      {shouldShowErrors && (
        <Centered>
          <h3>could not load suggestions</h3>
          <Link to="/library">library</Link>
        </Centered>
      )}

      {shouldShowSuggestedNotations && (
        <>
          <List>
            {suggestedNotations.map((notation) => {
              return (
                <ListItem key={notation.id}>
                  <Link to={`/n/${notation.id}`}>
                    <Row>
                      <Col span={6}>
                        <Thumbnail src={notation.thumbnailUrl} alt={notation.songName} />
                      </Col>
                      <Col span={18}>
                        <TextOuter>
                          <BlackText>
                            <b>{truncate(notation.songName, { length: 30 })}</b>
                          </BlackText>
                          <BlackText>by {truncate(notation.artistName, { length: 30 })}</BlackText>
                          <MutedText> {truncate(notation.transcriber.username, { length: 30 })}</MutedText>
                        </TextOuter>
                        <TagsOuter>
                          {notation.tags.map((tag) => (
                            <Tag key={tag.id}>{tag.name}</Tag>
                          ))}
                        </TagsOuter>
                      </Col>
                    </Row>
                  </Link>
                </ListItem>
              );
            })}
          </List>

          <br />

          <Row justify="center">
            <Link to="/library">library</Link>
          </Row>
        </>
      )}

      {shouldShowFallback && (
        <Centered>
          <h3>something went wrong</h3>
          <Link to="/library">library</Link>
        </Centered>
      )}
    </Outer>
  );
};
