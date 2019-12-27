import { Observable, Subject } from "rxjs";
import { scan, startWith } from "rxjs/operators";

// const observable = new Observable(subscriber => {
//   subscriber.next(1);
//   subscriber.next(2);
//   subscriber.next(3);
//   setTimeout(() => {
//     subscriber.next(4);
//     subscriber.complete();
//   }, 1000);
// }).pipe(take(1));

// const stream$ = observable.subscribe({
//   next: v => console.log(v),
//   error: err => console.log(err),
//   complete: () => console.log("complete")
// });

// console.dir(stream$);


/**
 * Initialization
 */

/**
 *
 */
const initialStore = {
  counter: 0
};

/**
 *
 */
const handlers = {
  INCREMENT: store => ({ ...store, counter: store.counter + 1 }),
  DECREMENT: store => ({ ...store, counter: store.counter - 1 }),
  DEFAULT: store => store
};

/**
 *
 * @param {*} store
 * @param {*} action
 */
function rootReducer(store = initialStore, action) {
  const handler = handlers[action.type] || handlers.DEFAULT;

  return handler(store, action);
}

/**
 *
 * @param {*} rootReducer
 */
function createStore(reducer) {
  const subj$ = new Subject();

  const store$ = subj$.pipe(
    startWith({ type: "__INIT__" }),
    scan(reducer, undefined)
  );

  store$.dispatch = action => subj$.next(action);

  return store$;
}


/**
 * Usage
 */

const incBtn = document.querySelector("#inc");
const decBtn = document.querySelector("#dec");
const result = document.querySelector("#result");

const store = createStore(rootReducer);

store.subscribe(state => {
  result.textContent = JSON.stringify(state, null, 2);
});

/**
 *
 */
incBtn.addEventListener("click", () => {
  store.dispatch({ type: "INCREMENT" });
});

/**
 *
 */
decBtn.addEventListener("click", () => {
  store.dispatch({ type: "DECREMENT" });
});
