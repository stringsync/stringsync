import { Col, Row, Tag } from 'antd';
import { truncate } from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useSuggestedNotations } from './useSuggestedNotations';

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

type SuggestedNotationsProps = {
  srcNotationId: string;
};

export const SuggestedNotations: React.FC<SuggestedNotationsProps> = (props) => {
  const [suggestedNotations, errors, isLoading] = useSuggestedNotations(props.srcNotationId, NUM_SUGGESTIONS);

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
                      <Col xs={0} sm={0} md={0} lg={6} xl={4} xxl={4}>
                        <Thumbnail src={notation.thumbnailUrl} alt={notation.songName} />
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={18} xl={20} xxl={20}>
                        <TextOuter>
                          <BlackText>
                            <b>{truncate(notation.songName, { length: 30 })}</b>
                          </BlackText>
                          <BlackText>by {truncate(notation.artistName, { length: 30 })}</BlackText>
                          <MutedText>
                            <small>{truncate(notation.transcriber.username, { length: 30 })}</small>
                          </MutedText>
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

          <Centered>
            <Link to="/library">library</Link>
          </Centered>

          <br />
          <br />
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
