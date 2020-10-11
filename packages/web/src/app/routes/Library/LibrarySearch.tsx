import { CloseCircleOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { Tag } from '@stringsync/domain';
import { Affix, Button, Input, Row } from 'antd';
import CheckableTag from 'antd/lib/tag/CheckableTag';
import React, { ChangeEvent, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../../store';

const AffixInner = styled.div<{ xs: boolean; affixed: boolean }>`
  background: ${(props) => (props.affixed ? '#FFFFFF' : 'transparent')};
  padding: ${(props) => (props.affixed && !props.xs ? '0 24px' : '0')};
  transition: all 150ms ease-in;
`;

const TagSearch = styled(Row)`
  margin-top: 8px;
`;

const Search = styled.div<{ xs: boolean }>`
  padding: 24px 0;
  margin: 0 ${(props) => (props.xs ? 24 : 0)}px;
`;

const SearchIcon = styled(SearchOutlined)`
  color: rgba(0, 0, 0, 0.25);
`;

interface Props {
  query: string;
  tagIds: Set<string>;
  isSearching: boolean;
  onQueryChange: (query: string) => void;
  onTagIdsChange: (tagIds: Set<string>) => void;
}

export const LibrarySearch: React.FC<Props> = (props) => {
  // store state
  const xs = useSelector<RootState, boolean>((state) => state.viewport.xs);
  const tags = useSelector<RootState, Tag[]>((state) => state.tag.tags);

  // local state
  const [affixed, setAffixed] = useState(false);

  // computed
  const hasQueryOrTagChecked = Boolean(props.query.length || props.tagIds.size);

  // callbacks
  const onAffixChange = (affixed?: boolean | undefined) => {
    if (typeof affixed === 'boolean') {
      setAffixed(affixed);
    }
  };

  const onQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    props.onQueryChange(event.target.value);
  };

  const onQueryTagCheckChange = (tagId: string) => (isChecked: boolean) => {
    const tagIds = new Set(Array.from(props.tagIds));
    if (isChecked) {
      tagIds.add(tagId);
    } else {
      tagIds.delete(tagId);
    }
    props.onTagIdsChange(tagIds);
  };

  const onQueryClear = () => {
    props.onQueryChange('');
    props.onTagIdsChange(new Set());
  };

  return (
    <>
      <Affix onChange={onAffixChange}>
        <AffixInner xs={xs} affixed={affixed}>
          <Search xs={xs}>
            <Input
              value={props.query}
              onChange={onQueryChange}
              placeholder="song, artist, or transcriber name"
              prefix={props.isSearching ? <LoadingOutlined /> : <SearchIcon />}
              suffix={hasQueryOrTagChecked ? <CloseCircleOutlined onClick={onQueryClear} /> : null}
            />
            <TagSearch justify="center" align="middle">
              {tags.map((tag) => (
                <CheckableTag key={tag.id} checked={props.tagIds.has(tag.id)} onChange={onQueryTagCheckChange(tag.id)}>
                  {tag.name}
                </CheckableTag>
              ))}
            </TagSearch>
          </Search>
        </AffixInner>
      </Affix>

      <Row justify="center">
        {hasQueryOrTagChecked ? (
          <Button type="link" size="small" onClick={onQueryClear}>
            remove filters
          </Button>
        ) : (
          <Button size="small">{/* Dummy button for DOM spacing */}</Button>
        )}
      </Row>
    </>
  );
};
