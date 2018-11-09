import * as React from 'react';

interface IProps {
  queryString: string;
  queryTags: string[];
  onClear: () => void;
}

export const Inputs: React.SFC<IProps> = () => <div>inputs</div>;
