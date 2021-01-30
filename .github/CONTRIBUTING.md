# Contributing to The Liturgists App

Thanks for being a part of this! Here are a few things you should know before getting started.

## Code of Conduct

This project is guided by a [Contributor Code of Conduct](.github/CODE_OF_CONDUCT.md).
By participating in the project, you agree to abide by its terms.

## Spec/Designs

The full spec for the iteration of the app currently in development
is available as a [Google doc].
The visual designs for the app are available through [InVision] (you'll need
to create an InVision account).

[Google doc]: https://docs.google.com/document/d/19yWA-ZGdDPEbK9tJpZdazzoFRhkT7Ja2-zP1fBq5V2c/
[InVision]: https://invis.io/EVE2P3L4R

## What should I work on?

It's up to you! Some ideas:

### Pick up a quest
Some tasks are already planned out and prioritized. They’ll appear in the
**To Do** column on the [main project board]. You can also check the
[active milestone] to see what things we're working on.

If you find something in the [general backlog] (but not yet prioritized
in the project board), that you'd really like to work on, that's great too!
Whatever you pick up, just assign the issue to yourself and drop a note in
`#react-native` on Slack.

### Craft a quest
Some items aren’t planned out in detail yet, but they have a starting point.
They’ll appear as tasks on issues in the [epic board]. As you'll see when
you create a [new issue], we generally follow a [Quests] model so that every
piece of work contains enough motivation and context that anyone can pick it
up and get going.

[main project board]: https://github.com/theliturgists/app/projects/1
[active milestone]: https://github.com/theliturgists/app/milestones
[general backlog]: https://github.com/theliturgists/app/issues
[new issue]: https://github.com/theliturgists/app/issues/new
[epic board]: https://github.com/theliturgists/app/projects/2
[Quests]: https://medium.com/@trek/source-quest-ff7d227d8fed

### Review some code
All pull requests require at least one approved review before they can be
merged, so you can help a ton by reviewing your teammates' code. The [main
project board] has a "Needs Review" column which lists PRs that are waiting
for reviews. (Make sure you move your PR to this column when it's ready for
review.)


## Pull Requests

Every contribution should be done via pull request, so that your peers on the team have a chance
to review the code for style, cleanliness, efficiency, and other points of general cromulence.
This is a great way for us to all learn from each others' experience, so please take the time
to go through the process; it will benefit the project and the team greatly.

Before you start working on your PR, however, please make sure there's an issue that
describes the work-to-happen, and make sure you're assigned to the issue. Since we
have an asynchronous, distributed team, this will help ensure we don't have conflicts
with multiple people unexpectedly working on the same thing. Your team lead will try
to keep a full and prioritized backlog of items to be worked on, but in the inevitable
event that you start something not yet in the backlog, please make your own issue and
assign yourself.

## Style guides

### Git commit messages

From [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/):

1. Separate subject from body with a blank line.
1. Limit the subject line to 50 characters.
1. Capitalize the subject line.
1. Do not end the subject line with a period.
1. Use the imperative mood in the subject line.
1. Wrap the body at 72 characters.
1. Use the body to explain what and why vs. how.

Other notes:
* Reference issues and pull requests liberally after the first line
* When only changing documentation, include `[ci skip]` in the commit description

### JavaScript code style

This project adheres to the Airbnb style guides for [JavaScript](https://github.com/airbnb/javascript/)
and [React/JSX](https://github.com/airbnb/javascript/tree/master/react). The one major deviation known
at this time is that React component files shall be named with a `.js` suffix, NOT `.jsx` (see #4 for why).

Though it's not an explicit rule, let's document functions like this (roughly [JSDoc]):

```javascript
/**
 * Return the given number times itself.
 *
 * Negative numbers are not allowed, because <reasons>.
 *
 * @param {number} n - number to square
 * @return {number} The squared number
 * @throw {Error} if you try to square a negative number,
 *   you salty scalawag, you
 */
function square(n: number): number {
  if (n < 0) {
    throw Error('no negative numbers!');
  }
  return n * n;
}
```

We use [eslint] to automatically check style rules. You can run eslint via `npm run lint`,
and it will be automatically run as a pre-commit hook. It can also be extremely helpful
to configure the eslint plugin for your editor of choice, as this helps you find issues
as you go rather than all at once when you commit. (details left as an exercise for the reader)

[eslint]: https://eslint.org
[JSDoc]: http://usejsdoc.org

### Static type-checking with [Flow]

TODO

[Flow]: https://flow.org

### React-specific code style

- Document props in `propTypes` declaration

### Redux-specific code style

- Actions should be [flux standard actions]
  - The easiest way to do this is using the [redux-actions] helpers
  - For reducers, refer `handleActions` to `handleAction` (easier to add more actions later)
- Organize state by the [ducks] pattern
  - Put related [epics] in `epic.js` and `export default `a single epic (perhaps via `combineEpic`)
- Create selectors for connect components rather than directly accessing state
  - If a selector only reads state related to a single reducer, put it in the same duck
  - Otherwise, put it in `state/selectors/`
  - If a selector is more computationally intensive than a trivial retrieval of state,
    consider using [reselect] to memoize it.
- Document action creators and selectors as you would [any other function][function-docs];
  they are the main API of each duck.
  - Since action creators all return [flux standard actions], instead of describing
    the return value, you can just describe the action's payload (if there is one).
- Separate [presentation and container components] (where it makes sense)
  - Prefer to keep presentation components as simple as possible
  - Push logic *out* of components and *into* selectors, epics, action creators,
    or helper components
  - `export default` the container component via redux `connect`
  - Export the presentation component as a named export for simple unit testing

[flux standard actions]: https://github.com/acdlite/flux-standard-action
[redux-actions]: https://github.com/reduxactions/redux-actions
[ducks]: https://github.com/alexnm/re-ducks
[epics]: https://redux-observable.js.org/docs/basics/Epics.html
[reselect]: https://redux.js.org/docs/recipes/ComputingDerivedData.html
[function-docs]: https://github.com/airbnb/javascript#comments--multiline
[presentation and container components]: https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
