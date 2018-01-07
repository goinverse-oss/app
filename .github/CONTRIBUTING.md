# Contributing to The Liturgists App

Thanks for being a part of this! Here are a few things you should know before getting started.

## Code of Conduct

This project is guided by a [Contributor Code of Conduct](.github/CODE_OF_CONDUCT.md).
By participating in the project, you agree to abide by its terms.

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

### Redux-specific code style

TODO
