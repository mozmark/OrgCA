# OrgCA - A Firefox addon to help organizations manage their own CA

# Instructions

Some customization is needed before you can make use of this tool. In
particular, you will need to:

1. Set your own addon name, title and id
2. Add your own roots to the addon
3. Set an update URL for your addon

It's **really important** to carry out all of these steps; failure to do so
could result in your users' browsers trusting things you don't want them to.

## Roots you want to trust

These should be copied into the 'data' directory, and the filenames listed in trust.txt (also within the 'data' directory).

## Roots you no longer trust

These should be copied into the 'data' directory, with the filenames added to distrust.txt
