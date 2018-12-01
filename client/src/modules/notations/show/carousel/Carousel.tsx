import * as React from 'react';
import { compose, withProps, withHandlers, withState, lifecycle } from 'recompose';
import { Carousel as AntdCarousel, Icon, Row, Col } from 'antd';
import { Page } from './Page';
import { INotation } from '../../../../@types/notation';
import { chunk } from 'lodash';
import styled from 'react-emotion';
import withSizes from 'react-sizes';

interface IProps {
  initialNotationId: number;
  notations: INotation[];
}

interface INotationsPerPageProps {
  notationsPerPage: number;
}

interface IGroupProps {
  notationGroups: INotation[][];
}

interface IStateProps {
  carousel: any;
  initialized: boolean;
  setCarousel: (carousel: any) => void;
  setInitialized: (initialized: boolean) => void;
}

interface IHandlerProps {
  handleCarouselRef: (carousel: any) => void;
  handleCarouselLeft: () => void;
  handleCarouselRight: () => void;
}

type InnerProps = IProps & IGroupProps & IStateProps & IHandlerProps;

const enhance = compose<InnerProps, IProps>(
  withSizes(size => ({
    notationsPerPage: Math.floor((size.width * 0.5) / 108)
  })),
  withProps<IGroupProps, IProps & INotationsPerPageProps>(props => ({
    notationGroups: chunk(props.notations, props.notationsPerPage)
  })),
  withState('carousel', 'setCarousel', null),
  withState('initialized', 'setInitialized', false),
  withHandlers <IProps & IGroupProps & IStateProps, IHandlerProps>({
    handleCarouselRef: props => carousel => {
      props.setCarousel(carousel);
    },
    handleCarouselLeft: props => () => {
      if (!props.carousel) {
        return;
      }

      props.carousel.prev();
    },
    handleCarouselRight: props => () => {
      if (!props.carousel) {
        return;
      }

      props.carousel.next();
    }
  }),
  lifecycle<InnerProps, {}, {}>({
    componentDidUpdate() {
      if (!this.props.initialized && this.props.carousel) {
        this.props.carousel.goTo(0);
        this.props.setInitialized(true);
      }
    }
  })
);

const Outer = styled('div')`
  margin-left: 8px;
  margin-right: 8px;
  width: 100%;
`;

const Title = styled('h2')`
  font-size: 1.25em;
  text-align: center;
`;

const CarouselBtn = styled('button')`
  background: none;
  height: 100px;
  cursor: pointer;
  padding: 0 16px;
  border: 1px solid ${props => props.theme['@muted']};
`;

export const Carousel = enhance(props => (
  <Row type="flex" justify="center">
    <Outer>
      <Title>suggestions</Title>
      <Row type="flex" justify="center" align="middle">
        <Col span={2}>
          <Row type="flex" justify="start">
            <CarouselBtn onClick={props.handleCarouselLeft}>
              <Icon type="left" />
            </CarouselBtn>
          </Row>
        </Col>
        <Col span={20}>
          <AntdCarousel
            dots={false}
            ref={props.handleCarouselRef}
          >
            {props.notationGroups.map((notationGroup, ndx) => (
              <Page key={ndx} notations={notationGroup} />
            ))}
          </AntdCarousel>
        </Col>
        <Col span={2}>
          <Row type="flex" justify="end">
            <CarouselBtn onClick={props.handleCarouselRight}>
              <Icon type="right" />
            </CarouselBtn>
          </Row>
        </Col>
      </Row>
    </Outer>
  </Row>
));
