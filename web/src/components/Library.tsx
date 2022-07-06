import { CloseCircleOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { Affix, Alert, Button, Input, List, Row } from 'antd';
import CheckableTag from 'antd/lib/tag/CheckableTag';
import { isEqual, uniq, without } from 'lodash';
import React, { ChangeEventHandler, MouseEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useViewport } from '../ctx/viewport/useViewport';
import { Layout, withLayout } from '../hocs/withLayout';
import { useDebouncer } from '../hooks/useDebouncer';
import { GqlReqStatus } from '../hooks/useGql2';
import { useNotationPreviews } from '../hooks/useNotationPreviews';
import { useTags } from '../hooks/useTags';
import { compose } from '../util/compose';
import { Duration } from '../util/Duration';
import { IntersectionTrigger } from './IntersectionTrigger';
import { NotationCard } from './NotationCard';
import { SonarSearch } from './SonarSearch';

const PAGE_SIZE = 9;
const DEBOUNCE_DELAY = Duration.sec(1);

const Outer = styled.div<{ xs: boolean }>`
  margin: 24px ${(props) => (props.xs ? 0 : 24)}px;
  margin-left: 0;
  margin-right: 0;
`;

const AffixInner = styled.div<{ xs: boolean; affixed: boolean }>`
  background: ${(props) => (props.affixed ? '#FFFFFF' : 'transparent')};
  padding: ${(props) => (props.affixed && !props.xs ? '0 24px' : '0')};
  transition: all 150ms ease-in;
`;

const SearchOuter = styled.div<{ xs: boolean }>`
  padding: 16px 0;
  margin: 0 ${(props) => (props.xs ? 16 : 0)}px;
`;

const SearchIcon = styled(SearchOutlined)`
  color: rgba(0, 0, 0, 0.25);
`;

const TagSearch = styled(Row)`
  margin-top: 8px;
`;

const StyledCheckableTag = styled(CheckableTag)`
  margin: 4px;
`;

const AlertOuter = styled.div<{ xs: boolean }>`
  margin: 0 ${(props) => (props.xs ? 24 : 0)}px;
`;

const LoadingIcon = styled(LoadingOutlined)`
  font-size: 5em;
  color: ${(props) => props.theme['@border-color']};
`;

const NoMore = styled.h2`
  color: ${(props) => props.theme['@muted']};
`;

const enhance = compose(withLayout(Layout.DEFAULT));

export const Library: React.FC = enhance(() => {
  const { xs, sm } = useViewport();

  const [tags] = useTags();

  const [affixed, setAffixed] = useState(false);
  const onAffixChange = (nextAffixed?: boolean | undefined) => setAffixed(!!nextAffixed);

  const [query, setQuery] = useState('');
  const [tagIds, setTagIds] = useState(new Array<string>());
  const tagIdsSet = useMemo(() => new Set(tagIds), [tagIds]);
  const onQueryChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setQuery(event.target.value);
  };
  const onTagIdsChange = (tagId: string) => (isChecked: boolean) => {
    const normalize = (tagIds: string[]) => uniq(tagIds).sort();
    let nextTagIds: string[];
    if (isChecked) {
      nextTagIds = normalize([...tagIds, tagId]);
    } else {
      nextTagIds = normalize(without([...tagIds], tagId));
    }
    if (!isEqual(tagIds, nextTagIds)) {
      setTagIds(nextTagIds);
    }
  };
  const isTagChecked = useCallback((tagId: string) => tagIdsSet.has(tagId), [tagIdsSet]);
  const hasSearchTerm = query.length > 0 || tagIds.length > 0;
  const onSearchTermClear: MouseEventHandler<HTMLSpanElement> = (event) => {
    setQuery('');
    setTagIds([]);
  };

  const [notations, pageInfo, loadPage, status] = useNotationPreviews(PAGE_SIZE, query, tagIds);
  const [hasLoadedFirstPageOnce, setHasLoadedFirstPageOnce] = useState(false);
  useEffect(() => {
    setHasLoadedFirstPageOnce((hasLoadedFirstPageOnce) => hasLoadedFirstPageOnce || pageInfo.hasLoadedFirstPage);
  }, [pageInfo]);
  const [debouncing, debounce] = useDebouncer(DEBOUNCE_DELAY, { leading: !hasLoadedFirstPageOnce });
  useEffect(debounce, [debounce, query, tagIds]);

  const onIntersectionEnter = useCallback(() => {
    !debouncing && loadPage();
  }, [debouncing, loadPage]);

  const isLoading = debouncing || status === GqlReqStatus.Init || status === GqlReqStatus.Pending;
  const shouldShowErrors = status === GqlReqStatus.Error;
  const shouldShowList = !debouncing && pageInfo.hasLoadedFirstPage && notations.length > 0;
  const shouldShowNothingFound = !debouncing && pageInfo.hasLoadedFirstPage && notations.length === 0;
  const shouldShowNoMoreContent =
    !debouncing && pageInfo.hasLoadedFirstPage && !pageInfo.hasNextPage && notations.length > 0;

  return (
    <Outer data-testid="library" xs={xs}>
      <Affix onChange={onAffixChange}>
        <AffixInner xs={xs} affixed={affixed}>
          <SearchOuter xs={xs}>
            <Input
              value={query}
              onChange={onQueryChange}
              placeholder="song, artist, or transcriber name"
              prefix={<SearchIcon />}
              suffix={hasSearchTerm && <CloseCircleOutlined onClick={onSearchTermClear} />}
            />
            <TagSearch justify="center" align="middle">
              {tags.map((tag) => (
                <StyledCheckableTag key={tag.id} checked={isTagChecked(tag.id)} onChange={onTagIdsChange(tag.id)}>
                  {tag.name}
                </StyledCheckableTag>
              ))}
            </TagSearch>
          </SearchOuter>
        </AffixInner>
      </Affix>

      <Row justify="center" align="middle">
        {hasSearchTerm ? (
          <Button type="link" size="small" onClick={onSearchTermClear}>
            remove filters
          </Button>
        ) : (
          <Button size="small">{/* Dummy button for DOM spacing */}</Button>
        )}
      </Row>

      {shouldShowList && (
        <>
          <br />
          <br />

          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
            style={{ padding: xs || sm ? '16px' : 0, border: '1px solid rgba(255,255,255,0)' }}
            dataSource={notations}
            rowKey={(notation) => notation.id}
            renderItem={(notation) => (
              <List.Item>
                <Link to={`/n/${notation.id}`}>
                  <NotationCard notation={notation} query={query} isTagChecked={isTagChecked} />
                </Link>
              </List.Item>
            )}
          />
        </>
      )}

      {shouldShowNothingFound && (
        <>
          <br />
          <br />

          <Row justify="center" align="middle">
            <SonarSearch style={{ width: '50%' }} />
          </Row>

          <br />

          <Row justify="center">
            <NoMore>did not find anything</NoMore>
          </Row>
        </>
      )}

      <IntersectionTrigger onEnter={onIntersectionEnter} />

      {shouldShowErrors && (
        <AlertOuter xs={xs}>
          <Alert showIcon closable type="error" message="something went wrong" />
        </AlertOuter>
      )}

      {isLoading && (
        <>
          <br />
          <br />
          <Row justify="center">{<LoadingIcon />}</Row>
        </>
      )}

      {shouldShowNoMoreContent && (
        <Row justify="center">
          <NoMore>no more content</NoMore>
        </Row>
      )}
    </Outer>
  );
});

export default Library;
