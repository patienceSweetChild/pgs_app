-- RLS for expanded tables

-- Helper: published content readable by public
-- Catalog geo
alter table public.countries enable row level security;
alter table public.universities enable row level security;
alter table public.catalog_tags enable row level security;
alter table public.program_tags enable row level security;
alter table public.course_tags enable row level security;
alter table public.event_tags enable row level security;
alter table public.university_tags enable row level security;
alter table public.catalog_filter_facets enable row level security;
alter table public.catalog_filter_options enable row level security;
alter table public.program_filter_options enable row level security;
alter table public.course_filter_options enable row level security;
alter table public.event_filter_options enable row level security;
alter table public.university_filter_options enable row level security;
alter table public.catalog_draft_revisions enable row level security;
alter table public.university_meeting_slots enable row level security;

create policy countries_public_select on public.countries
  for select to anon, authenticated
  using (published = true or public.staff_has_permission('catalog.manage'));
create policy countries_staff_write on public.countries
  for all to authenticated
  using (public.staff_has_permission('catalog.manage'))
  with check (public.staff_has_permission('catalog.manage'));

create policy universities_public_select on public.universities
  for select to anon, authenticated
  using (published = true or public.staff_has_permission('catalog.manage'));
create policy universities_staff_write on public.universities
  for all to authenticated
  using (public.staff_has_permission('catalog.manage'))
  with check (public.staff_has_permission('catalog.manage'));

create policy catalog_tags_public_select on public.catalog_tags
  for select to anon, authenticated
  using (published = true or public.staff_has_permission('catalog.manage'));
create policy catalog_tags_staff_write on public.catalog_tags
  for all to authenticated
  using (public.staff_has_permission('catalog.manage'))
  with check (public.staff_has_permission('catalog.manage'));

create policy program_tags_select on public.program_tags
  for select to anon, authenticated using (true);
create policy program_tags_staff_write on public.program_tags
  for all to authenticated
  using (public.staff_has_permission('catalog.manage'))
  with check (public.staff_has_permission('catalog.manage'));

create policy course_tags_select on public.course_tags
  for select to anon, authenticated using (true);
create policy course_tags_staff_write on public.course_tags
  for all to authenticated
  using (public.staff_has_permission('catalog.manage'))
  with check (public.staff_has_permission('catalog.manage'));

create policy event_tags_select on public.event_tags
  for select to anon, authenticated using (true);
create policy event_tags_staff_write on public.event_tags
  for all to authenticated
  using (public.staff_has_permission('catalog.manage'))
  with check (public.staff_has_permission('catalog.manage'));

create policy university_tags_select on public.university_tags
  for select to anon, authenticated using (true);
create policy university_tags_staff_write on public.university_tags
  for all to authenticated
  using (public.staff_has_permission('catalog.manage'))
  with check (public.staff_has_permission('catalog.manage'));

create policy facets_public_select on public.catalog_filter_facets
  for select to anon, authenticated
  using (published = true or public.staff_has_permission('catalog.manage'));
create policy facets_staff_write on public.catalog_filter_facets
  for all to authenticated
  using (public.staff_has_permission('catalog.manage'))
  with check (public.staff_has_permission('catalog.manage'));

create policy filter_options_public_select on public.catalog_filter_options
  for select to anon, authenticated
  using (published = true or public.staff_has_permission('catalog.manage'));
create policy filter_options_staff_write on public.catalog_filter_options
  for all to authenticated
  using (public.staff_has_permission('catalog.manage'))
  with check (public.staff_has_permission('catalog.manage'));

create policy program_filter_options_select on public.program_filter_options
  for select to anon, authenticated using (true);
create policy program_filter_options_write on public.program_filter_options
  for all to authenticated
  using (public.staff_has_permission('catalog.manage'))
  with check (public.staff_has_permission('catalog.manage'));

create policy course_filter_options_select on public.course_filter_options
  for select to anon, authenticated using (true);
create policy course_filter_options_write on public.course_filter_options
  for all to authenticated
  using (public.staff_has_permission('catalog.manage'))
  with check (public.staff_has_permission('catalog.manage'));

create policy event_filter_options_select on public.event_filter_options
  for select to anon, authenticated using (true);
create policy event_filter_options_write on public.event_filter_options
  for all to authenticated
  using (public.staff_has_permission('catalog.manage'))
  with check (public.staff_has_permission('catalog.manage'));

create policy university_filter_options_select on public.university_filter_options
  for select to anon, authenticated using (true);
create policy university_filter_options_write on public.university_filter_options
  for all to authenticated
  using (public.staff_has_permission('catalog.manage'))
  with check (public.staff_has_permission('catalog.manage'));

create policy catalog_drafts_staff on public.catalog_draft_revisions
  for all to authenticated
  using (public.staff_has_permission('catalog.manage'))
  with check (public.staff_has_permission('catalog.manage'));

create policy univmeet_public_select on public.university_meeting_slots
  for select to anon, authenticated
  using (published = true or public.staff_has_permission('catalog.manage'));
create policy univmeet_staff_write on public.university_meeting_slots
  for all to authenticated
  using (public.staff_has_permission('catalog.manage'))
  with check (public.staff_has_permission('catalog.manage'));

-- CMS modules
alter table public.cms_editors enable row level security;
alter table public.cms_pages enable row level security;
alter table public.cms_page_revisions enable row level security;
alter table public.page_content enable row level security;
alter table public.faqs enable row level security;
alter table public.testimonials enable row level security;
alter table public.content_people enable row level security;
alter table public.weekly_wall_items enable row level security;
alter table public.highlights enable row level security;
alter table public.key_dates enable row level security;
alter table public.urgent_deadlines enable row level security;
alter table public.study_abroad_facts enable row level security;
alter table public.pgs_stats enable row level security;
alter table public.site_notices enable row level security;
alter table public.legal_documents enable row level security;
alter table public.site_social_links enable row level security;
alter table public.site_settings enable row level security;
alter table public.premium_content_settings enable row level security;
alter table public.article_categories enable row level security;
alter table public.articles enable row level security;

create policy cms_editors_staff on public.cms_editors
  for all to authenticated
  using (public.staff_has_permission('content.manage') or public.staff_has_permission('cms.publish'))
  with check (public.staff_has_permission('content.manage') or public.staff_has_permission('cms.publish'));

create policy cms_pages_public_select on public.cms_pages
  for select to anon, authenticated
  using (status = 'published' or public.staff_has_permission('content.manage'));
create policy cms_pages_staff_write on public.cms_pages
  for all to authenticated
  using (public.staff_has_permission('content.manage'))
  with check (public.staff_has_permission('content.manage'));

create policy cms_revisions_staff on public.cms_page_revisions
  for all to authenticated
  using (public.staff_has_permission('content.manage'))
  with check (public.staff_has_permission('content.manage'));

create policy page_content_public_select on public.page_content
  for select to anon, authenticated
  using (published = true or public.staff_has_permission('content.manage'));
create policy page_content_staff_write on public.page_content
  for all to authenticated
  using (public.staff_has_permission('content.manage'))
  with check (public.staff_has_permission('content.manage'));

create policy faqs_public_select on public.faqs
  for select to anon, authenticated
  using (published = true or public.staff_has_permission('content.manage'));
create policy faqs_staff_write on public.faqs
  for all to authenticated
  using (public.staff_has_permission('content.manage'))
  with check (public.staff_has_permission('content.manage'));

create policy testimonials_public_select on public.testimonials
  for select to anon, authenticated
  using (published = true or public.staff_has_permission('content.manage'));
create policy testimonials_staff_write on public.testimonials
  for all to authenticated
  using (public.staff_has_permission('content.manage'))
  with check (public.staff_has_permission('content.manage'));

create policy content_people_public_select on public.content_people
  for select to anon, authenticated
  using (published = true or public.staff_has_permission('content.manage'));
create policy content_people_staff_write on public.content_people
  for all to authenticated
  using (public.staff_has_permission('content.manage'))
  with check (public.staff_has_permission('content.manage'));

create policy weekly_wall_public_select on public.weekly_wall_items
  for select to anon, authenticated
  using (published = true or public.staff_has_permission('content.manage'));
create policy weekly_wall_staff_write on public.weekly_wall_items
  for all to authenticated
  using (public.staff_has_permission('content.manage'))
  with check (public.staff_has_permission('content.manage'));

create policy highlights_public_select on public.highlights
  for select to anon, authenticated
  using (published = true or public.staff_has_permission('content.manage'));
create policy highlights_staff_write on public.highlights
  for all to authenticated
  using (public.staff_has_permission('content.manage'))
  with check (public.staff_has_permission('content.manage'));

create policy key_dates_public_select on public.key_dates
  for select to anon, authenticated
  using (published = true or public.staff_has_permission('content.manage'));
create policy key_dates_staff_write on public.key_dates
  for all to authenticated
  using (public.staff_has_permission('content.manage'))
  with check (public.staff_has_permission('content.manage'));

create policy urgent_deadlines_public_select on public.urgent_deadlines
  for select to anon, authenticated
  using (published = true or public.staff_has_permission('content.manage'));
create policy urgent_deadlines_staff_write on public.urgent_deadlines
  for all to authenticated
  using (public.staff_has_permission('content.manage'))
  with check (public.staff_has_permission('content.manage'));

create policy study_facts_public_select on public.study_abroad_facts
  for select to anon, authenticated
  using (published = true or public.staff_has_permission('content.manage'));
create policy study_facts_staff_write on public.study_abroad_facts
  for all to authenticated
  using (public.staff_has_permission('content.manage'))
  with check (public.staff_has_permission('content.manage'));

create policy pgs_stats_public_select on public.pgs_stats
  for select to anon, authenticated
  using (published = true or public.staff_has_permission('content.manage'));
create policy pgs_stats_staff_write on public.pgs_stats
  for all to authenticated
  using (public.staff_has_permission('content.manage'))
  with check (public.staff_has_permission('content.manage'));

create policy site_notices_public_select on public.site_notices
  for select to anon, authenticated
  using (active = true or public.staff_has_permission('content.manage'));
create policy site_notices_staff_write on public.site_notices
  for all to authenticated
  using (public.staff_has_permission('content.manage'))
  with check (public.staff_has_permission('content.manage'));

create policy legal_public_select on public.legal_documents
  for select to anon, authenticated
  using (status = 'published' or public.staff_has_permission('content.manage'));
create policy legal_staff_write on public.legal_documents
  for all to authenticated
  using (public.staff_has_permission('content.manage'))
  with check (public.staff_has_permission('content.manage'));

create policy social_public_select on public.site_social_links
  for select to anon, authenticated
  using (published = true or public.staff_has_permission('content.manage'));
create policy social_staff_write on public.site_social_links
  for all to authenticated
  using (public.staff_has_permission('content.manage'))
  with check (public.staff_has_permission('content.manage'));

create policy site_settings_staff on public.site_settings
  for all to authenticated
  using (public.staff_has_permission('content.manage'))
  with check (public.staff_has_permission('content.manage'));

create policy premium_content_public_select on public.premium_content_settings
  for select to anon, authenticated
  using (published = true or public.staff_has_permission('content.manage'));
create policy premium_content_staff_write on public.premium_content_settings
  for all to authenticated
  using (public.staff_has_permission('content.manage'))
  with check (public.staff_has_permission('content.manage'));

create policy article_categories_public_select on public.article_categories
  for select to anon, authenticated
  using (published = true or public.staff_has_permission('content.manage'));
create policy article_categories_staff_write on public.article_categories
  for all to authenticated
  using (public.staff_has_permission('content.manage'))
  with check (public.staff_has_permission('content.manage'));

create policy articles_public_select on public.articles
  for select to anon, authenticated
  using (published = true or public.staff_has_permission('content.manage'));
create policy articles_staff_write on public.articles
  for all to authenticated
  using (public.staff_has_permission('content.manage'))
  with check (public.staff_has_permission('content.manage'));

-- Premium workspace deep
alter table public.premium_entitlement_events enable row level security;
alter table public.student_university_selections enable row level security;
alter table public.student_document_requirements enable row level security;
alter table public.student_documents enable row level security;
alter table public.document_upload_sessions enable row level security;
alter table public.document_shares enable row level security;
alter table public.workspace_comments enable row level security;
alter table public.review_queue_items enable row level security;
alter table public.counselor_notes enable row level security;
alter table public.student_alerts enable row level security;
alter table public.student_board_columns enable row level security;
alter table public.student_tasks enable row level security;
alter table public.premium_audit_logs enable row level security;

create policy pe_events_select on public.premium_entitlement_events
  for select to authenticated
  using (student_id = auth.uid() or public.staff_has_permission('premium.manage'));
create policy pe_events_staff_write on public.premium_entitlement_events
  for all to authenticated
  using (public.staff_has_permission('premium.manage'))
  with check (public.staff_has_permission('premium.manage'));

create policy uni_sel_select on public.student_university_selections
  for select to authenticated
  using (
    student_id = auth.uid()
    or public.staff_has_permission('students.manage')
    or public.staff_has_permission('students.manage_assigned')
  );
create policy uni_sel_write on public.student_university_selections
  for all to authenticated
  using (
    public.staff_has_permission('students.manage')
    or public.staff_has_permission('students.manage_assigned')
    or public.staff_has_permission('workspace.manage')
  )
  with check (
    public.staff_has_permission('students.manage')
    or public.staff_has_permission('students.manage_assigned')
    or public.staff_has_permission('workspace.manage')
  );

create policy doc_req_select on public.student_document_requirements
  for select to authenticated
  using (
    student_id = auth.uid()
    or public.staff_has_permission('documents.manage')
  );
create policy doc_req_write on public.student_document_requirements
  for all to authenticated
  using (public.staff_has_permission('documents.manage'))
  with check (public.staff_has_permission('documents.manage'));

create policy student_docs_select on public.student_documents
  for select to authenticated
  using (
    student_id = auth.uid()
    or public.staff_has_permission('documents.manage')
    or exists (
      select 1 from public.document_shares ds
      where ds.document_id = id
        and ds.recipient_user_id = auth.uid()
        and ds.revoked_at is null
    )
  );
create policy student_docs_insert on public.student_documents
  for insert to authenticated
  with check (student_id = auth.uid() or public.staff_has_permission('documents.manage'));
create policy student_docs_staff_update on public.student_documents
  for update to authenticated
  using (public.staff_has_permission('documents.manage'))
  with check (public.staff_has_permission('documents.manage'));

create policy upload_sessions_own on public.document_upload_sessions
  for all to authenticated
  using (student_id = auth.uid() or public.staff_has_permission('documents.manage'))
  with check (student_id = auth.uid() or public.staff_has_permission('documents.manage'));

create policy document_shares_select on public.document_shares
  for select to authenticated
  using (
    recipient_user_id = auth.uid()
    or shared_by = auth.uid()
    or public.staff_has_permission('documents.manage')
  );
create policy document_shares_write on public.document_shares
  for all to authenticated
  using (public.staff_has_permission('documents.manage'))
  with check (public.staff_has_permission('documents.manage'));

create policy workspace_comments_select on public.workspace_comments
  for select to authenticated
  using (
    (student_id = auth.uid() and visibility = 'student_visible')
    or public.staff_has_permission('workspace.manage')
  );
create policy workspace_comments_insert on public.workspace_comments
  for insert to authenticated
  with check (
    (student_id = auth.uid() and author_id = auth.uid() and visibility = 'student_visible')
    or public.staff_has_permission('workspace.manage')
  );

create policy review_queue_select on public.review_queue_items
  for select to authenticated
  using (
    (student_id = auth.uid() and student_visible = true)
    or public.staff_has_permission('workspace.manage')
  );
create policy review_queue_staff_write on public.review_queue_items
  for all to authenticated
  using (public.staff_has_permission('workspace.manage'))
  with check (public.staff_has_permission('workspace.manage'));

create policy counselor_notes_staff on public.counselor_notes
  for all to authenticated
  using (
    public.staff_has_permission('workspace.manage')
    or (visibility = 'student_visible' and student_id = auth.uid())
  )
  with check (public.staff_has_permission('workspace.manage'));

create policy student_alerts_select on public.student_alerts
  for select to authenticated
  using (
    (student_id = auth.uid() and active = true)
    or public.staff_has_permission('workspace.manage')
  );
create policy student_alerts_staff_write on public.student_alerts
  for all to authenticated
  using (public.staff_has_permission('workspace.manage'))
  with check (public.staff_has_permission('workspace.manage'));

create policy board_columns_select on public.student_board_columns
  for select to authenticated
  using (
    student_id = auth.uid()
    or public.staff_has_permission('workspace.manage')
  );
create policy board_columns_staff_write on public.student_board_columns
  for all to authenticated
  using (public.staff_has_permission('workspace.manage'))
  with check (public.staff_has_permission('workspace.manage'));

create policy student_tasks_select on public.student_tasks
  for select to authenticated
  using (
    student_id = auth.uid()
    or public.staff_has_permission('workspace.manage')
  );
create policy student_tasks_staff_write on public.student_tasks
  for all to authenticated
  using (public.staff_has_permission('workspace.manage'))
  with check (public.staff_has_permission('workspace.manage'));

create policy premium_audit_staff on public.premium_audit_logs
  for select to authenticated
  using (public.staff_has_permission('audit.read') or public.staff_has_permission('premium.manage'));
create policy premium_audit_insert on public.premium_audit_logs
  for insert to authenticated
  with check (public.is_active_staff());

-- Ops / CRM
alter table public.study_journey_enquiries enable row level security;
alter table public.deadline_subscriptions enable row level security;
alter table public.lead_triage_notes enable row level security;
alter table public.notifications enable row level security;
alter table public.staff_targets enable row level security;
alter table public.staff_registry_saved_views enable row level security;
alter table public.student_crm_tags enable row level security;
alter table public.student_crm_tag_links enable row level security;
alter table public.audit_events enable row level security;

create policy study_journey_insert on public.study_journey_enquiries
  for insert to anon, authenticated with check (true);
create policy study_journey_staff on public.study_journey_enquiries
  for select to authenticated using (public.staff_has_permission('leads.manage'));
create policy study_journey_staff_update on public.study_journey_enquiries
  for update to authenticated
  using (public.staff_has_permission('leads.manage'))
  with check (public.staff_has_permission('leads.manage'));

create policy deadline_sub_insert on public.deadline_subscriptions
  for insert to anon, authenticated with check (true);
create policy deadline_sub_staff on public.deadline_subscriptions
  for select to authenticated using (public.staff_has_permission('leads.manage'));

create policy lead_triage_staff on public.lead_triage_notes
  for all to authenticated
  using (public.staff_has_permission('leads.manage'))
  with check (public.staff_has_permission('leads.manage'));

create policy notifications_own on public.notifications
  for select to authenticated
  using (recipient_user_id = auth.uid() or public.staff_has_permission('notifications.manage'));
create policy notifications_update_own on public.notifications
  for update to authenticated
  using (recipient_user_id = auth.uid() or public.staff_has_permission('notifications.manage'))
  with check (recipient_user_id = auth.uid() or public.staff_has_permission('notifications.manage'));
create policy notifications_staff_insert on public.notifications
  for insert to authenticated
  with check (public.staff_has_permission('notifications.manage') or public.is_active_staff());

create policy staff_targets_own on public.staff_targets
  for all to authenticated
  using (staff_user_id = auth.uid() or public.staff_has_permission('staff.manage'))
  with check (staff_user_id = auth.uid() or public.staff_has_permission('staff.manage'));

create policy saved_views_own on public.staff_registry_saved_views
  for all to authenticated
  using (staff_user_id = auth.uid())
  with check (staff_user_id = auth.uid());

create policy crm_tags_staff on public.student_crm_tags
  for all to authenticated
  using (public.staff_has_permission('students.manage') or public.staff_has_permission('students.read'))
  with check (public.staff_has_permission('students.manage'));

create policy crm_tag_links_staff on public.student_crm_tag_links
  for all to authenticated
  using (public.staff_has_permission('students.manage') or public.staff_has_permission('students.read'))
  with check (public.staff_has_permission('students.manage'));

create policy audit_events_staff on public.audit_events
  for select to authenticated
  using (public.staff_has_permission('audit.read'));
create policy audit_events_insert on public.audit_events
  for insert to authenticated
  with check (public.is_active_staff());
