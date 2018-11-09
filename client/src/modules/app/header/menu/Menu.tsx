import * as React from 'react';
import { compose, renderComponent } from 'recompose';
import { cond } from '../../../../enhancers';
import { connect } from 'react-redux';
import { ISession } from '../../../../@types/session';
import { IStore } from '../../../../@types/store';
import { AdminMenu } from './AdminMenu';
import { TeacherMenu } from './TeacherMenu';
import { StudentMenu } from './StudentMenu';
import { SignedOutMenu } from './SignedOutMenu';

interface IInnerProps {
  session: ISession;
}

// Verify both signedIn and role since the default role for a signedOut
// user is student.
const isSignedInAs = (role: string, session: ISession): boolean => (
  session.signedIn && session.role === role
);

const enhance = compose<IInnerProps, {}>(
  connect((state: IStore) => ({ session: state.session })),
  cond<IInnerProps>([
    [props => isSignedInAs('admin', props.session), renderComponent(AdminMenu)],
    [props => isSignedInAs('teacher', props.session), renderComponent(TeacherMenu)],
    [props => isSignedInAs('student', props.session), renderComponent(StudentMenu)]
  ])
);

export const Menu = enhance(() => <SignedOutMenu />);
