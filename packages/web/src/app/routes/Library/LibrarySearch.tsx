import { CloseCircleOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { Tag } from '@stringsync/domain';
import { Affix, Button, Input, Row } from 'antd';
import CheckableTag from 'antd/lib/tag/CheckableTag';
import { isEqual } from 'lodash';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useEffectOnce } from '../../../hooks';
import { AppDispatch, getTags, RootState } from '../../../store';
import { clearPages, setQuery, setTagIds } from '../../../store/library';

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

interface Props {}

export const LibrarySearch: React.FC<Props> = (props) => {
  // store state
  const dispatch = useDispatch<AppDispatch>();
  const xs = useSelector<RootState, boolean>((state) => state.viewport.xs);
  const tags = useSelector<RootState, Tag[]>((state) => state.tag.tags);
  const query = useSelector<RootState, string>((state) => state.library.query);
  const tagIds = useSelector<RootState, Set<string>>((state) => new Set(state.library.tagIds), isEqual);
  const isPending = useSelector<RootState, boolean>((state) => state.library.isPending);

  // local state
  const [affixed, setAffixed] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // computed
  const hasSearchTerm = Boolean(query.length || tagIds.size);

  // callbacks
  const onAffixChange = (affixed?: boolean | undefined) => {
    if (typeof affixed === 'boolean') {
      setAffixed(affixed);
    }
  };

  const onQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsSearching(true);
    dispatch(clearPages());
    dispatch(setQuery({ query: event.target.value }));
  };

  const onQueryTagCheckChange = (tagId: string) => (isChecked: boolean) => {
    const nextTagIds = new Set(Array.from(tagIds));
    if (isChecked) {
      nextTagIds.add(tagId);
    } else {
      nextTagIds.delete(tagId);
    }
    setIsSearching(true);
    dispatch(clearPages());
    dispatch(setTagIds({ tagIds: Array.from(nextTagIds) }));
  };

  const onQueryClear = () => {
    setIsSearching(true);
    dispatch(clearPages());
    dispatch(setQuery({ query: '' }));
    dispatch(setTagIds({ tagIds: [] }));
  };

  // effects
  useEffectOnce(() => {
    dispatch(getTags());
  });

  useEffect(() => {
    if (!isPending) {
      setIsSearching(false);
    }
  }, [isPending]);

  return (
    <>
      <Affix onChange={onAffixChange}>
        <AffixInner xs={xs} affixed={affixed}>
          <Search xs={xs}>
            <Input
              value={query}
              onChange={onQueryChange}
              placeholder="song, artist, or transcriber name"
              prefix={isSearching ? <LoadingOutlined /> : <SearchIcon />}
              suffix={hasSearchTerm ? <CloseCircleOutlined onClick={onQueryClear} /> : null}
            />
            <TagSearch justify="center" align="middle">
              {tags.map((tag) => (
                <CheckableTag key={tag.id} checked={tagIds.has(tag.id)} onChange={onQueryTagCheckChange(tag.id)}>
                  {tag.name}
                </CheckableTag>
              ))}
            </TagSearch>
          </Search>
        </AffixInner>
      </Affix>

      <Row justify="center">
        {hasSearchTerm ? (
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
