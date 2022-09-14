export type UniqueIdentifier = string | number;

export type Type = string | number;

export type Data = Record<string, any>;

type Resolve<T> = T | Promise<T>;

interface Node<T> {
  id: UniqueIdentifier;
  data: Data;
  disabled: boolean;
  ref: T;
  measure(node: Node<T>): Resolve<Rect>;
}

export interface Draggable<T> extends Node<T> {
  type: Type;
  modifiers?: Modifier[];
  sensors?: Sensor[];
}

export interface Droppable<T> extends Node<T> {
  accepts: Type[];
}

type Modifier = () => {};

interface Constraint {}

interface Sensor {
  constraints: Constraint[];
}

export interface Rect {
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface DragDropState<T> {
  active: UniqueIdentifier | null;
  over: UniqueIdentifier | null;
  position: Point | null;
  draggables: Map<UniqueIdentifier, Draggable<T>>;
  droppables: Map<UniqueIdentifier, Droppable<T>>;
}

export interface DraggableManager<T> {
  active: UniqueIdentifier | null;
  // modifiers: Modifier[];
  position: Point | null;
  nodes: Map<UniqueIdentifier, Draggable<T>>;
}

export interface DroppableManager<T> {
  over: UniqueIdentifier | null;
  nodes: Map<UniqueIdentifier, Droppable<T>>;
}

export interface Collision {}

interface Listener<T> {
  listener(state: T): void;
  selector?(state: T): T[keyof T];
}

function createStore<T, U>(
  initialState: T,
  reducer: (state: T, action: U) => T
) {
  let state = initialState;
  const listeners = new Set<Listener<T>>();
  const propListeners = new Map<keyof T, Set<Listener<T>>>();
  const setState = (fn: (currentState: T) => T) => {
    const newState = fn(state);

    if (newState !== state) {
      listeners.forEach(({listener, selector}) => {
        if (!selector || selector(state) !== selector(newState)) {
          listener(newState);
        }
      });

      state = newState;
    }

    return state;
  };

  return {
    getState() {
      return state;
    },
    dispatch(action: U) {
      return setState((state) => reducer(state, action));
    },
    subscribe(listener: Listener<T>) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

enum Action {
  DragStart,
  DragMove,
  DragOver,
  DragEnd,
  RegisterDraggable,
  UnregisterDraggable,
  RegisterDroppable,
  UnregisterDroppable,
}

export interface Point {
  x: number;
  y: number;
}

export interface Position {
  initial: Point;
  current: Point;
}

type DragActions =
  | {type: Action.DragStart; data: {id: UniqueIdentifier}}
  | {type: Action.DragOver; data: {id: UniqueIdentifier | null}}
  | {type: Action.DragMove; data: {position: Point}}
  | {type: Action.DragEnd};

type DraggableActions =
  | {
      type: Action.RegisterDraggable;
      data: Draggable<any>;
    }
  | {type: Action.UnregisterDraggable; data: {id: UniqueIdentifier}};

type DroppableActions =
  | {
      type: Action.RegisterDroppable;
      data: Droppable<any>;
    }
  | {type: Action.UnregisterDroppable; data: {id: UniqueIdentifier}};

type Actions = DragActions | DraggableActions | DroppableActions;

function reducer(state: DragDropState<any>, action: Actions) {
  switch (action.type) {
    case Action.DragStart:
      if (state.active != null) {
        return state;
      }

      return {
        ...state,
        active: action.data.id,
      };
    case Action.DragOver: {
      return {
        ...state,
        over: action.data.id,
      };
    }
    case Action.DragMove: {
      return {
        ...state,
        position: action.data.position,
      };
    }
    case Action.DragEnd:
      if (state.active == null) {
        return state;
      }

      return {
        ...state,
        active: null,
      };
    case Action.RegisterDraggable:
      const draggable = action.data;

      state.draggables.set(draggable.id, draggable);

      return {
        ...state,
        draggables: new Map(state.draggables),
      };
    case Action.UnregisterDraggable:
      state.draggables.delete(action.data.id);

      return {
        ...state,
        draggables: new Map(state.draggables),
      };
    default:
      return state;
  }
}

export class DragDropManager<T> {
  public getState: () => DragDropState<T>;
  public dispatch: (action: Actions) => void;
  public subscribe: (
    listener: Listener<DragDropState<T>>['listener'],
    selector?: Listener<DragDropState<T>>['selector']
  ) => void;

  constructor() {
    const initialState: DragDropState<T> = {
      active: null,
      position: null,
      over: null,
      draggables: new Map(),
      droppables: new Map(),
    };

    const {getState, subscribe, dispatch} = createStore(initialState, reducer);

    this.getState = getState;
    this.dispatch = dispatch;
    this.subscribe = (listener, selector) => subscribe({listener, selector});
  }
}

const computeCollisions: any = null;

class CollisionManager<T> {
  public collisions: Collision[] | null = null;

  constructor(manager: DragDropManager<T>) {
    manager.subscribe(
      (state) => {
        this.collisions = computeCollisions(state.position, state.droppables);
      },
      (state) => (state.position?.x ?? 0) + (state.position?.y ?? 0)
    );
  }
}

function App() {
  const dragDropManager = new DragDropManager<Element>();
  const collisionManager = new CollisionManager(dragDropManager);
}
