type FunctionType = (...args: any[]) => any;
type ActionCreatorsMapObject = { [actionCreator: string]: FunctionType };

declare type ActionsUnion<A extends ActionCreatorsMapObject> = ReturnType<A[keyof A]>;
