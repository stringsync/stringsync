import $ from 'jquery';

const configureJquery = () => {
  (window as any).$ = $;
};

export default configureJquery;
