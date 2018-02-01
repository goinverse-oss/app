# Common components

This directory is for holding the common, reusable compoments that make up the
visual language of The Liturgists app. They are probably usually going to be
stateless and functional, unless there's a compelling reason to do otherwise.
In particular, a compoment should only live here if we are confident that it
is going to be shared between multiple screens in the app. Otherwise, it should
live inside `screens/FooScreen/components`, so as to communicate that it is
only used in that screen.
