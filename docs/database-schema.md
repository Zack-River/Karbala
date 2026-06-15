# Database Schema

## seasons

* id
* title
* subtitle
* intro
* hero_image
* logo_image
* is_active
* created_at
* updated_at

## nights

* id
* number
* title
* slug
* short_description
* teaser
* why_important
* central_idea
* quote
* quote_author
* reflection_question
* practical_step
* cover_image
* audio_file
* pdf_file
* status
* sort_order
* seo_title
* seo_description
* seo_image
* created_at
* updated_at

## topics

* id
* night_id
* title
* content
* sort_order

## verses

* id
* night_id
* content
* sort_order

## narrations

* id
* night_id
* content
* sort_order

## resources

* id
* night_id
* title
* category
* url
* sort_order

## cards

* id
* night_id
* type
* title
* content
* image
* downloadable
* status
* featured
* sort_order

## attachments

* id
* night_id
* title
* type
* file_url
* downloadable
* status
* created_at
* updated_at
