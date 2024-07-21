# reusefull-react


We are going to replace the non-WordPress portion of the website with a React front end and a C# back end (possibly via Lambdas on AWS).
1. We need to decide how we want to deploy and host.  Hopefully something with an automated deploy so we don't need to give all developers admin rights to deploy.
2. * Possibly AWS Lightsail.
   * Possibly https://buddy.works
   * Possibly Vercel: https://vercel.com/
3. We are using github projects to track the coding to do list: https://github.com/orgs/codeforkansascity/projects/1

I think software development projects might benefit from two separate todo lists.  One for project management stuff, the other for code features.

Here is some project management stuff to do (some already done):
| Task            | Who             | Details         | Status  |
|-----------------|-----------------|-----------------|---------|
| Create github repository | Paul    | Named Reusefull-react    | done |
| - Make Rob an Admin | Paul    |     | done |
| Invite people to slack channel | Rob    |     | in progress |
| Add people to slack channel | Paul    |     | in progress |
| Choose architecture | Rob    |     | React and C# Backend |
| Document architecture | Rob    |     |  |
| Create initial react site | Rob    |     |  |
| Create initial C# site | Rob    |     |  |
| Create a Project in Github | Rob    |     |  |
| Document architecture | Rob    |     |  |

# Software resources
* https://auth0.com/docs/customize/integrations/aws/aws-api-gateway-custom-authorizers
* https://learn.microsoft.com/en-us/visualstudio/javascript/tutorial-asp-net-core-with-react?view=vs-2022
* borrow UI ideas from here: https://www.donategoodstuff.org/donate-stuff.html
* borrow UI ideas from here: https://recyclespot.org/ 
* get AI dev resources here: https://app.smartsheet.com/b/form/220ec8bd29e8439eab06191fe2e199a3

# Items to add to project task list
* Phase 1 (UI for public searches)
  * Search orgs.  A page to replace this: https://app.reusefull.org/donate 
  * View org details.  A page to replace pages like this: https://app.reusefull.org/charity/191 
  * Show on maps.  A page to replace this: https://app.reusefull.org/donate/results 
  * Search on map within range of zip code
* Phase 2 (UI for Adding/Maintaing Organizations)
  * Add auth0, confirm email first. 
  * Add, edit org profile.
  * Add items accepted. 
  * Add "drives'.
  * Approve org profile.
  * Auth 0 create account.  Fill out org info. Wait for approval.
* Phase 3 (Special events enhancements
  * Search special events and drives. 

# REST Endpoints
* This is a REST Endpoint you can use for testing.  It returns a list of item categories for donations
  * https://script.google.com/macros/s/AKfycbxBEYLmsjbGfwUa_ONZR67lOhdgLVHyH_7xoUhnYjRAKSNnCe3ru-ezbW1lJz9d0Wfj/exec
* This is a REST Endpoint you can use for testing.  It returns a list of organization categories for donations
  * https://script.google.com/macros/s/AKfycbx9_rJzrtBV7u00y3akrhY0U1xX_78RcGlZOEWGOGQhdBKSpT9gKz8IsbhADDoMRNPH/exec  
* This is a REST Endpoint you can use for testing.  It returns a partial list of organizations
  *  https://script.google.com/macros/s/AKfycbwppj5DOvXQ3I1_OM9Npkoh5h5GGE1evJXM8c5y_dBXb7oYkzGqg_hSqAzNAEm0QkOTxA/exec
* Organization match search results (do matching client side?)
* List of all organizations
* Details for each organization (all organizations), including logos and link to org profile page
  * 
