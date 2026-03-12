# CHANGELOG

Please read [GUIDELINES / Release process 🚀](/GUIDELINES.md#release-process-) before making a release.

## Releases

## Release Candidates

### 1.0.0-rc.4

+ Send SMS notification on repair ticket closure.
+ Add location to Ticket.
+ Enable localized story titles in admin portal and API.
+ Toggle vehicle details visibility in create mode.
+ Add fail-safe routing to index.html in CloudFront.

* Fix shop creation and deletion issues in WebEdit.
* Fix required fields for opening hours – temporary hours no longer require regular opening hours.
* Fix duplicate values occurring in latitude/longitude fields.
* Fix address parsing and remove localisation dependency for body text.
* Fix CloudFront invalidation pipeline step.
* Fix intermittent 403 AccessDenied errors in CDK.
* Fix homepage story cards to use slugs for navigation.
* Fix redirect to login when current user is deleted.
* Fix deleting user not also deleting reference token.
* Fix only lowercase and numbers allowed for usernames.
* Initialize vehicles list in Location entity.
* Homepage card buttons use correct translations.

### 1.0.0-rc.3

+ Add GPG encryption to PostgreSQL backups.
+ Integrate CloudFront CDN for image delivery to replace direct S3 bucket URLs.
+ Refactor image storage to use S3 subfolders and store only filenames in the database.
+ Add automated PostgreSQL backups to S3 with cron scheduling.
+ Add automatic closing of dropdowns when ownership is set to customer.
+ Reduce required fields in create vehicle - dropdown now defaults to closed when customer owned. 

* Improve AWS security by transitioning to IAM instance profiles - remove hardcoded access keys.
* Simplify CDK stack structure by merging nested stacks and updated access permissions.
* Refine environment variables - renamed buckets and added backup bucket variable.
* Fix couldn't crete stories in webedit - remove NOT NULL constraint on body text.
* Maintain vehicle details dropdown when switching between vehicles – ensure consistent UI behavior.
* Update AWS version across all relevant files and configurations.
* Separate translation keys for Customer and Organization enums to allow for distinct labeling.

- Removed email address requirement when creating a new Customer.
- Removed email address from shop cards.


### 1.0.0-rc.2

* Update pipelines with support for rebuilding web in environment of choice – that the publish pipeline needed for web edit change to publish.

### 1.0.0-rc.1

+ Enforce english in portal – override to always return english since many texts are not localized yet.
+ Repair Ticket no longer has start/end date.
+ Add shortcut "/" to focus search bar.

* Fix refresh token invalidated during local development - prevented refresh tokens from working.
* Fix log out not working in front end – was not updated to lastest spec.
* Fix refresh token not removed on log out
* Fix issues with jsdom polyfill needed for tip tap on SSR – resolved with native tip tap SSR supported utilities.
* Fix couldn't save/create Tickets or Stories – id was set in applyToEntity causing null ids.
* Fix WebEdit lang select dropdown disabled in read mode – one should be able to change language in read mode.
* Fix couldn't remove images from entities – outdated entity list in ImageRepository.
* Fix some entities not editables, missing @NoArgsConstructor caused Http Converter to fail.
* Fix couldn't update vehicle because of reg tag conflict – reg tag validation should only be on create, not edit.
* Fix repairDescription not returned in dto of repair Ticket.
* Fix search bars not working – enums helper had faulty logic.

- Removed unused ticket annotation for discriminated union.

### 1.0.0-rc.0

No release notes – first release candidate since the inception, 353 commits later...