import React from 'react';

export interface NoneLayoutProps {}

const NoneLayout: React.FC<NoneLayoutProps> = (props) => <>{props.children}</>;

export default NoneLayout;
