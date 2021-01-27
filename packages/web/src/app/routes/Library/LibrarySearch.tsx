import { CloseCircleOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { PublicTag } from '@stringsync/domain';
import { Affix, Button, Input, Row } from 'antd';
import CheckableTag from 'antd/lib/tag/CheckableTag';
import React, { ChangeEventHandler, MouseEventHandler, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useEffectOnce } from '../../../hooks';
import { AppDispatch, getTags, RootState } from '../../../store';

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
  const dispatch = useDispatch<AppDispatch>();
  const tags = useSelector<RootState, PublicTag[]>((state) => state.tag.tags);
  const xs = useSelector<RootState, boolean>((state) => state.viewport.xs);

  const [affixed, setAffixed] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [tagIds, setTagIds] = useState(new Set<string>());

  const hasSearchTerm = query.length > 0 || tagIds.size > 0;

  const onAffixChange = (affixed?: boolean) => {
    setAffixed(!!affixed);
  };

  const onQueryChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setQuery(event.target.value);
  };

  const onQueryClear: MouseEventHandler<HTMLSpanElement> = (event) => {
    setQuery('');
    setTagIds(new Set());
  };

  const onQueryTagCheckChange = (tagId: string) => (isChecked: boolean) => {
    const nextTagIds = new Set(Array.from(tagIds));
    if (isChecked) {
      nextTagIds.add(tagId);
    } else {
      nextTagIds.delete(tagId);
    }
    setTagIds(nextTagIds);
  };

  useEffectOnce(() => {
    dispatch(getTags());
  });

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
