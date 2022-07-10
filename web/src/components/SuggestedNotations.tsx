import { Button, Col, Row, Tag } from 'antd';
import { ButtonType } from 'antd/lib/button';
import { truncate } from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useSuggestedNotations } from '../hooks/useSuggestedNotations';

const NUM_SUGGESTIONS = 10;

const Outer = styled.div`
  margin-top: 8px;
`;

const Centered = styled.div`
  text-align: center;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  padding-top: 8px;
  padding-bottom: 8px;
  margin: 0;
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

const LibraryLink: React.FC<{ block?: boolean; type?: ButtonType }> = (props) => {
  const type = props.type || 'primary';
  const block = props.block || true;

  return (
    <Link to="/library">
      <Button block={block} type={type} size="large">
        library
      </Button>
    </Link>
  );
};

type SuggestedNotationsProps = {
  srcNotationId: string;
};

export const SuggestedNotations: React.FC<SuggestedNotationsProps> = (props) => {
  const [suggestedNotations, errors, loading] = useSuggestedNotations(props.srcNotationId, NUM_SUGGESTIONS);

  const hasErrors = errors.length > 0;
  const hasSuggestedNotations = suggestedNotations.length > 0;

  const shouldShowNoSuggestionsFound = !loading && !hasErrors && !hasSuggestedNotations;
  const shouldShowErrors = !loading && hasErrors;
  const shouldShowSuggestedNotations = !loading && !hasErrors && hasSuggestedNotations;
  const shouldShowFallback =
    !loading && !shouldShowNoSuggestionsFound && !shouldShowErrors && !shouldShowSuggestedNotations;

  return (
    <Outer>
      {shouldShowNoSuggestionsFound && (
        <Centered>
          <h3>no suggestions found</h3>
          <LibraryLink />
        </Centered>
      )}

      {shouldShowErrors && (
        <Centered>
          <h3>could not load suggestions</h3>
          <LibraryLink />
        </Centered>
      )}

      {shouldShowSuggestedNotations && (
        <>
          <LibraryLink type="link" />

          <br />
          <br />

          <List>
            {suggestedNotations.map((notation) => {
              return (
                <ListItem key={notation.id}>
                  <Link to={`/n/${notation.id}`}>
                    <Row>
                      <Col xs={6} sm={6} md={6} lg={6} xl={4} xxl={4}>
                        <Thumbnail src={notation.thumbnailUrl || ''} alt={notation.songName} />
                      </Col>
                      <Col xs={18} sm={18} md={18} lg={18} xl={20} xxl={20}>
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

          <LibraryLink />

          <br />
          <br />
        </>
      )}

      {shouldShowFallback && (
        <Centered>
          <h3>something went wrong</h3>
          <LibraryLink />
        </Centered>
      )}
    </Outer>
  );
};
