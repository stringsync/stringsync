import { UserRole } from '../lib/graphql';
import * as cmp from './compareUserRoles';
import { compareUserRoles } from './compareUserRoles';

describe('compareUserRoles', () => {
  it('compares student roles', () => {
    expect(compareUserRoles(UserRole.STUDENT, UserRole.STUDENT)).toBe(0);
    expect(compareUserRoles(UserRole.STUDENT, UserRole.TEACHER)).toBe(-1);
    expect(compareUserRoles(UserRole.STUDENT, UserRole.ADMIN)).toBe(-1);
  });

  it('compares teacher roles', () => {
    expect(compareUserRoles(UserRole.TEACHER, UserRole.STUDENT)).toBe(1);
    expect(compareUserRoles(UserRole.TEACHER, UserRole.TEACHER)).toBe(0);
    expect(compareUserRoles(UserRole.TEACHER, UserRole.ADMIN)).toBe(-1);
  });

  it('compares admin roles', () => {
    expect(compareUserRoles(UserRole.ADMIN, UserRole.STUDENT)).toBe(1);
    expect(compareUserRoles(UserRole.ADMIN, UserRole.TEACHER)).toBe(1);
    expect(compareUserRoles(UserRole.ADMIN, UserRole.ADMIN)).toBe(0);
  });

  describe('student comparators', () => {
    it('ltStudent', () => {
      expect(cmp.ltStudent(UserRole.STUDENT)).toBe(false);
      expect(cmp.ltStudent(UserRole.TEACHER)).toBe(false);
      expect(cmp.ltStudent(UserRole.ADMIN)).toBe(false);
    });

    it('ltEqStudent', () => {
      expect(cmp.ltEqStudent(UserRole.STUDENT)).toBe(true);
      expect(cmp.ltEqStudent(UserRole.TEACHER)).toBe(false);
      expect(cmp.ltEqStudent(UserRole.ADMIN)).toBe(false);
    });

    it('eqStudent', () => {
      expect(cmp.eqStudent(UserRole.STUDENT)).toBe(true);
      expect(cmp.eqStudent(UserRole.TEACHER)).toBe(false);
      expect(cmp.eqStudent(UserRole.ADMIN)).toBe(false);
    });

    it('gtEqStudent', () => {
      expect(cmp.gtEqStudent(UserRole.STUDENT)).toBe(true);
      expect(cmp.gtEqStudent(UserRole.TEACHER)).toBe(true);
      expect(cmp.gtEqStudent(UserRole.ADMIN)).toBe(true);
    });

    it('gtStudent', () => {
      expect(cmp.gtStudent(UserRole.STUDENT)).toBe(false);
      expect(cmp.gtStudent(UserRole.TEACHER)).toBe(true);
      expect(cmp.gtStudent(UserRole.ADMIN)).toBe(true);
    });
  });

  describe('teacher comparators', () => {
    it('ltTeacher', () => {
      expect(cmp.ltTeacher(UserRole.STUDENT)).toBe(true);
      expect(cmp.ltTeacher(UserRole.TEACHER)).toBe(false);
      expect(cmp.ltTeacher(UserRole.ADMIN)).toBe(false);
    });

    it('ltEqTeacher', () => {
      expect(cmp.ltEqTeacher(UserRole.STUDENT)).toBe(true);
      expect(cmp.ltEqTeacher(UserRole.TEACHER)).toBe(true);
      expect(cmp.ltEqTeacher(UserRole.ADMIN)).toBe(false);
    });

    it('eqTeacher', () => {
      expect(cmp.eqTeacher(UserRole.STUDENT)).toBe(false);
      expect(cmp.eqTeacher(UserRole.TEACHER)).toBe(true);
      expect(cmp.eqTeacher(UserRole.ADMIN)).toBe(false);
    });

    it('gtEqTeacher', () => {
      expect(cmp.gtEqTeacher(UserRole.STUDENT)).toBe(false);
      expect(cmp.gtEqTeacher(UserRole.TEACHER)).toBe(true);
      expect(cmp.gtEqTeacher(UserRole.ADMIN)).toBe(true);
    });

    it('gtTeacher', () => {
      expect(cmp.gtTeacher(UserRole.STUDENT)).toBe(false);
      expect(cmp.gtTeacher(UserRole.TEACHER)).toBe(false);
      expect(cmp.gtTeacher(UserRole.ADMIN)).toBe(true);
    });
  });

  describe('admin comparators', () => {
    it('ltAdmin', () => {
      expect(cmp.ltAdmin(UserRole.STUDENT)).toBe(true);
      expect(cmp.ltAdmin(UserRole.TEACHER)).toBe(true);
      expect(cmp.ltAdmin(UserRole.ADMIN)).toBe(false);
    });

    it('ltEqAdmin', () => {
      expect(cmp.ltEqAdmin(UserRole.STUDENT)).toBe(true);
      expect(cmp.ltEqAdmin(UserRole.TEACHER)).toBe(true);
      expect(cmp.ltEqAdmin(UserRole.ADMIN)).toBe(true);
    });

    it('eqAdmin', () => {
      expect(cmp.eqAdmin(UserRole.STUDENT)).toBe(false);
      expect(cmp.eqAdmin(UserRole.TEACHER)).toBe(false);
      expect(cmp.eqAdmin(UserRole.ADMIN)).toBe(true);
    });

    it('gtEqAdmin', () => {
      expect(cmp.gtEqAdmin(UserRole.STUDENT)).toBe(false);
      expect(cmp.gtEqAdmin(UserRole.TEACHER)).toBe(false);
      expect(cmp.gtEqAdmin(UserRole.ADMIN)).toBe(true);
    });

    it('gtAdmin', () => {
      expect(cmp.gtAdmin(UserRole.STUDENT)).toBe(false);
      expect(cmp.gtAdmin(UserRole.TEACHER)).toBe(false);
      expect(cmp.gtAdmin(UserRole.ADMIN)).toBe(false);
    });
  });
});
