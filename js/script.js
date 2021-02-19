var fetchXml = document.querySelector("#fetchXml");
var orgURL = document.querySelector("#orgURL");
var plural = document.querySelector("#plural");
var testButton = document.querySelector("#testButton");
var requestURI = document.querySelector("#requestURI");
var queryName = document.querySelector("#queryName");
var apiVersion = "/api/data/v9.2/";
var finalLink = "";
var pluralName = "";
var plurals = { entitydataprovider: "entitydataproviders", msdyn_organizationalunit: "msdyn_organizationalunits", topicmodel: "topicmodels", bookableresourcecharacteristic: "bookableresourcecharacteristic", mailbox: "mailboxes", sdkmessagepair: "sdkmessagepairs", customerrelationship: "customerrelationships", msdyn_fieldcomputation: "msdyn_fieldcomputations", convertrule: "convertrules", msdynsm_salessitemap: "msdynsm_salessitemaps", msdyn_orderinvoicingproduct: "msdyn_orderinvoicingproducts", msdyn_fact: "msdyn_facts", sdkmessagerequestfield: "sdkmessagerequestfields", appmodulemetadatadependency: "appmodulemetadatadependencycollection", msdyn_purchaseorderbill: "msdyn_purchaseorderbills", msdyn_resourcecategorypricelevel: "msdyn_resourcecategorypricelevels", msdyn_scheduleboardsetting: "msdyn_scheduleboardsettings", orginsightsnotification: "orginsightsnotifications", postrole: "postroles", socialactivity: "socialactivities", account: "accounts", msdyn_incidenttypeproduct: "msdyn_incidenttypeproducts", bulkoperation: "bulkoperations", msdyn_paymentmethod: "msdyn_paymentmethods", activitypointer: "activitypointers", team: "teams", offlinecommanddefinition: "offlinecommanddefinitions", socialinsightsconfiguration: "socialinsightsconfigurations", campaignactivity: "campaignactivities", plugintracelog: "plugintracelogs", msdyn_invoicefrequency: "msdyn_invoicefrequencies", imagedescriptor: "imagedescriptors", stringmap: "stringmaps", msdyn_orderlinetransaction: "msdyn_orderlinetransactions", quotedetail: "quotedetails", fieldpermission: "fieldpermissions", syncerror: "syncerrors", msdyn_opportunitylinetransactioncategory: "msdyn_opportunitylinetransactioncategories", postcomment: "postcomments", fieldsecurityprofile: "fieldsecurityprofiles", role: "roles", connection: "connections", msdyn_transactionconnection: "msdyn_transactionconnections", transformationmapping: "transformationmappings", msdyn_rtvproduct: "msdyn_rtvproducts", msdyn_workorderproduct: "msdyn_workorderproducts", msdyn_invoicefrequencydetail: "msdyn_invoicefrequencydetails", invaliddependency: "invaliddependencies", msdyn_postalbum: "msdyn_postalbums", salesorderdetail: "salesorderdetails", entitlementtemplate: "entitlementtemplates", integrationstatus: "integrationstatuses", mobileofflineprofileitem: "mobileofflineprofileitems", msdyn_projectapproval: "msdyn_projectapprovals", msdyn_requirementresourcecategory: "msdyn_requirementresourcecategories", queueitemcount: "queueitemcounts", usermapping: "usermappings", publisheraddress: "publisheraddresses", msdyn_purchaseorderproduct: "msdyn_purchaseorderproducts", campaignresponse: "campaignresponses", msdyn_servicetasktype: "msdyn_servicetasktypes", msdyn_configuration: "msdyn_configurations", kbarticle: "kbarticles", routingruleitem: "routingruleitems", msdyn_workhourtemplate: "msdyn_workhourtemplates", postlike: "postlikes", connectionroleobjecttypecode: "connectionroleobjecttypecodes", importdata: "importdatas", globalsearchconfiguration: "globalsearchconfigurations", importlog: "importlogs", customcontrolresource: "customcontrolresources", organizationstatistic: "organizationstatistic", msdyn_transactioncategory: "msdyn_transactioncategories", msdyn_timegroupdetail: "msdyn_timegroupdetails", importentitymapping: "importentitymappings", campaign: "campaigns", mailboxtrackingfolder: "mailboxtrackingfolders", opportunityproduct: "opportunityproducts", interprocesslock: "interprocesslock", uomschedule: "uomschedules", msdyn_expense: "msdyn_expenses", picklistmapping: "picklistmappings", msdyn_agreementbookingdate: "msdyn_agreementbookingdates", uom: "uoms", ratingmodel: "ratingmodel", mobileofflineprofileitemassociation: "mobileofflineprofileitemassociations", appmodulemetadata: "appmodulemetadatacollection", msdyn_quotelineanalyticsbreakdown: "msdyn_quotelineanalyticsbreakdowns", workflow: "workflows", systemusermanagermap: "systemusermanagermaps", sqlencryptionaudit: "sqlencryptionaudits", plugintype: "plugintypes", leadaddress: "leadaddresses", msdyn_odatav4ds: "msdyn_odatav4dses", msdyn_quotelinetransactionclassification: "msdyn_quotelinetransactionclassifications", rollupfield: "rollupfields", fixedmonthlyfiscalcalendar: "fixedmonthlyfiscalcalendars", subscription: "subscriptions", opportunitysalesprocess: "opportunitysalesprocesses", invoice: "invoices", reportentity: "reportentities", unresolvedaddress: "unresolvedaddresses", territory: "territories", activitymimeattachment: "activitymimeattachments", msdyn_orderlineresourcecategory: "msdyn_orderlineresourcecategories", topichistory: "topichistories", appmodulemetadataoperationlog: "appmodulemetadataoperationlogcollection", childincidentcount: "childincidentcounts", msdyn_workordertype: "msdyn_workordertypes", suggestioncardtemplate: "suggestioncardtemplates", msdyn_batchjob: "msdyn_batchjobs", lookupmapping: "lookupmappings", msdyn_quotelineresourcecategory: "msdyn_quotelineresourcecategories", msdyn_paymentdetail: "msdyn_paymentdetails", subject: "subjects", attributemap: "attributemaps", msdyn_invoicelinetransaction: "msdyn_invoicelinetransactions", dataperformance: "dataperformances", bookableresourcecategory: "bookableresourcecategory", msdyn_shipvia: "msdyn_shipvias", localconfigstore: "localconfigstores", msdyn_quotebookingincident: "msdyn_quotebookingincidents", dynamicpropertyinstance: "dynamicpropertyinstances", msdyn_requirementorganizationunit: "msdyn_requirementorganizationunits", actioncard: "actioncards", knowledgebaserecord: "knowledgebaserecords", msdyn_quotebookingproduct: "msdyn_quotebookingproducts", sdkmessageprocessingstepimage: "sdkmessageprocessingstepimages", msdyn_orderinvoicingsetupdate: "msdyn_orderinvoicingsetupdates", syncattributemapping: "syncattributemappings", attachment: "attachments", msdyn_agreementbookingservice: "msdyn_agreementbookingservices", msdyn_inventoryjournal: "msdyn_inventoryjournals", bookableresourcecategoryassn: "bookableresourcecategoryassn", msdyn_bpf_2c5fe86acc8b414b8322ae571000c799: "msdyn_bpf_2c5fe86acc8b414b8322ae571000c799s", msdyn_opportunitylinetransactionclassificatio: "msdyn_opportunitylinetransactionclassificatios", duplicaterulecondition: "duplicateruleconditions", businessunit: "businessunits", msdyn_inventoryadjustment: "msdyn_inventoryadjustments", msdyn_agreementinvoicesetup: "msdyn_agreementinvoicesetups", msdyn_rma: "msdyn_rmas", advancedsimilarityrule: "advancedsimilarityrules", msdyn_estimate: "msdyn_estimates", msdyn_timeoffcalendar: "msdyn_timeoffcalendars", msdyn_quotebookingservicetask: "msdyn_quotebookingservicetasks", subscriptionstatisticsoutlook: "subscriptionstatisticsoutlook", msdyn_quotebookingservice: "msdyn_quotebookingservices", topicmodelconfiguration: "topicmodelconfigurations", msdyn_bookingjournal: "msdyn_bookingjournals", email: "emails", msdyn_contactpricelist: "msdyn_contactpricelists", msdyn_customerasset: "msdyn_customerassets", recurringappointmentmaster: "recurringappointmentmasters", ribbonclientmetadata: "ribbonclientmetadata", queue: "queues", msdyn_agreementinvoicedate: "msdyn_agreementinvoicedates", msdyn_projectteam: "msdyn_projectteams", usersettings: "usersettingses", transformationparametermapping: "transformationparametermappings", msdyn_uniquenumber: "msdyn_uniquenumbers", msdyn_opportunitylinetransaction: "msdyn_opportunitylinetransactions", partnerapplication: "partnerapplications", duplicaterecord: "duplicaterecords", principalsyncattributemap: "principalsyncattributemaps", savedorginsightsconfiguration: "savedorginsightsconfigurations", kbarticletemplate: "kbarticletemplates", subscriptionsyncinfo: "subscriptionsyncinfos", entitlement: "entitlements", importmap: "importmaps", incident: "incidents", systemuser: "systemusers", customcontrol: "customcontrols", msdyn_transactionorigin: "msdyn_transactionorigins", dynamicproperty: "dynamicproperties", officegraphdocument: "officegraphdocuments", organizationui: "organizationuis", reportcategory: "reportcategories", officedocument: "officedocuments", msdyn_purchaseorder: "msdyn_purchaseorders", sla: "slas", emailserverprofile: "emailserverprofiles", queuemembercount: "queuemembercounts", goalrollupquery: "goalrollupqueries", recordcountsnapshot: "recordcountsnapshots", ribbonrule: "ribbonrules", calendarrule: "calendarrules", convertruleitem: "convertruleitems", msdyn_workordersubstatus: "msdyn_workordersubstatuses", msdyn_timeoffrequest: "msdyn_timeoffrequests", bookingstatus: "bookingstatus", msdyn_workorder: "msdyn_workorders", mailmergetemplate: "mailmergetemplates", hierarchysecurityconfiguration: "hierarchysecurityconfiguration", similarityrule: "similarityrules", competitoraddress: "competitoraddresses", msdyn_incidenttype: "msdyn_incidenttypes", azureserviceconnection: "azureserviceconnections", transactioncurrency: "transactioncurrencies", ribbondiff: "ribbondiffs", postfollow: "postfollows", msdyn_rolecompetencyrequirement: "msdyn_rolecompetencyrequirements", topic: "topics", principalobjectaccessreadsnapshot: "principalobjectaccessreadsnapshots", userquery: "userqueries", solution: "solutions", msdyn_resourcepaytype: "msdyn_resourcepaytypes", task: "tasks", msdyn_quotelinetransactioncategory: "msdyn_quotelinetransactioncategories", msdyn_resourcerequirementdetail: "msdyn_resourcerequirementdetails", msdyn_inventorytransfer: "msdyn_inventorytransfers", userentityuisettings: "userentityuisettingses", msdyn_projectparameterpricelist: "msdyn_projectparameterpricelists", msdyn_workorderservicetask: "msdyn_workorderservicetasks", mailboxstatistics: "mailboxstatistics", opportunity: "opportunities", customeraddress: "customeraddresses", msdyn_transactioncategoryhierarchyelement: "msdyn_transactioncategoryhierarchyelements", msdyn_transactioncategoryclassification: "msdyn_transactioncategoryclassifications", customeropportunityrole: "customeropportunityroles", resource: "resources", msdc_colorgridconfig: "msdc_colorgridconfigs", msdyn_orderlinetransactionclassification: "msdyn_orderlinetransactionclassifications", contractdetail: "contractdetails", msdyn_clientextension: "msdyn_clientextensions", msdyn_quoteinvoicingproduct: "msdyn_quoteinvoicingproducts", resourcespec: "resourcespecs", msdyn_fieldservicesetting: "msdyn_fieldservicesettings", sdkmessageresponsefield: "sdkmessageresponsefields", productassociation: "productassociations", savedquery: "savedqueries", statusmap: "statusmaps", msdyn_quotepricelist: "msdyn_quotepricelists", channelaccessprofilerule: "channelaccessprofilerules", appconfig: "appconfigs", sharepointdocument: "sharepointdocuments", msdyn_resourceassignmentdetail: "msdyn_resourceassignmentdetails", teamprofiles: "teamprofiles", processsession: "processsession", resourcegroup: "resourcegroups", orginsightsmetric: "orginsightsmetrics", solutioncomponent: "solutioncomponents", goal: "goals", constraintbasedgroup: "constraintbasedgroups", incidentresolution: "incidentresolutions", msdyn_wallsavedquery: "msdyn_wallsavedqueries", msdyn_projectpricelist: "msdyn_projectpricelists", knowledgesearchmodel: "knowledgesearchmodels", equipment: "equipments", msdyn_incidenttypecharacteristic: "msdyn_incidenttypecharacteristics", msdyn_bookingalert: "msdyn_bookingalerts", emailhash: "emailhashs", webresource: "webresources", activityparty: "activityparties", msdynsm_servicessitemap: "msdynsm_servicessitemaps", wizardaccessprivilege: "wizardaccessprivileges", msdyn_rmasubstatus: "msdyn_rmasubstatuses", isvconfig: "isvconfigs", msdyn_bpf_989e9b1857e24af18787d5143b67523b: "msdyn_bpf_989e9b1857e24af18787d5143b67523bs", routingrule: "routingrules", metric: "metrics", msdyn_orderinvoicingsetup: "msdyn_orderinvoicingsetups", fax: "faxes", msdyn_warehouse: "msdyn_warehouses", msdyn_roleutilization: "msdyn_roleutilizations", displaystringmap: "displaystringmaps", msdyn_journalline: "msdyn_journallines", msdyn_postconfig: "msdyn_postconfigs", teamsyncattributemappingprofiles: "teamsyncattributemappingprofiles", msdyn_timeentry: "msdyn_timeentries", subscriptionsyncentryoffline: "subscriptionsyncentriesoffline", msdyn_requirementresourcepreference: "msdyn_requirementresourcepreferences", position: "positions", channelaccessprofile: "channelaccessprofiles", knowledgearticleviews: "knowledgearticleviews", businessunitmap: "businessunitmaps", opportunityclose: "opportunitycloses", subscriptionclients: "subscriptionclientses", appconfiginstance: "appconfiginstances", savedqueryvisualization: "savedqueryvisualizations", sdkmessagerequest: "sdkmessagerequests", dependencyfeature: "dependencyfeature", audit: "audit", msdyn_userworkhistory: "msdyn_userworkhistories", systemform: "systemforms", ratingvalue: "ratingvalue", msdyn_workorderdetailsgenerationqueue: "msdyn_workorderdetailsgenerationqueues", msdyn_postalcode: "msdyn_postalcodes", bookableresourcegroup: "bookableresourcegroup", template: "templates", sdkmessageresponse: "sdkmessageresponses", salesprocessinstance: "salesprocessinstances", rollupproperties: "rollupproperties", msdyn_wallsavedqueryusersettings: "msdyn_wallsavedqueryusersettingses", organization: "organizations", bookableresource: "bookableresource", multientitysearchentities: "multientitysearchentities", letter: "letters", pluginassembly: "pluginassemblies", aciviewmapper: "aciviewmappers", businessunitnewsarticle: "businessunitnewsarticles", rollupjob: "rollupjobs", knowledgearticle: "knowledgearticles", msdyn_approval: "msdyn_approvals", appmodule: "appmodules", msdyn_agreementinvoiceproduct: "msdyn_agreementinvoiceproducts", userqueryvisualization: "userqueryvisualizations", msdyn_purchaseorderreceipt: "msdyn_purchaseorderreceipts", leadtoopportunitysalesprocess: "leadtoopportunitysalesprocesses", characteristic: "characteristic", calendar: "calendars", userapplicationmetadata: "userapplicationmetadatacollection", msdyn_workorderincident: "msdyn_workorderincidents", sdkmessage: "sdkmessages", msdyn_bookingrule: "msdyn_bookingrules", report: "reports", msdyn_orderinvoicingdate: "msdyn_orderinvoicingdates", bulkoperationlog: "bulkoperationlogs", lead: "leads", newprocess: "newprocesses", msdyn_incidenttypeservice: "msdyn_incidenttypeservices", contact: "contacts", msdyn_mlresultcache: "msdyn_mlresultcaches", msdyn_productinventory: "msdyn_productinventories", replicationbacklog: "replicationbacklogs", quarterlyfiscalcalendar: "quarterlyfiscalcalendars", expiredprocess: "expiredprocesses", msdyn_accountpricelist: "msdyn_accountpricelists", textanalyticsentitymapping: "textanalyticsentitymappings", ribbontabtocommandmap: "ribbontabtocommandmap", ribboncustomization: "ribboncustomizations", applicationfile: "applicationfiles", asyncoperation: "asyncoperations", salesliterature: "salesliteratures", msdyn_agreementbookingservicetask: "msdyn_agreementbookingservicetasks", filtertemplate: "filtertemplates", msdyn_requirementstatus: "msdyn_requirementstatuses", displaystring: "displaystrings", timezonedefinition: "timezonedefinitions", userform: "userforms", msdyn_expensereceipt: "msdyn_expensereceipts", interactionforemail: "interactionforemails", privilegeobjecttypecodes: "privilegeobjecttypecodeses", product: "products", msdyn_resourceassignment: "msdyn_resourceassignments", annualfiscalcalendar: "annualfiscalcalendars", relationshiprolemap: "relationshiprolemaps", sdkmessageprocessingstep: "sdkmessageprocessingsteps", usersearchfacet: "usersearchfacets", bulkdeletefailure: "bulkdeletefailures", msdyn_delegation: "msdyn_delegations", msdyn_taxcodedetail: "msdyn_taxcodedetails", ownermapping: "ownermappings", msdyn_agreementbookingsetup: "msdyn_agreementbookingsetups", topicmodelexecutionhistory: "topicmodelexecutionhistories", translationprocess: "translationprocesses", importjob: "importjobs", appmodulecomponent: "app module components", sitemap: "sitemaps", principalobjectattributeaccess: "principalobjectattributeaccesses", dynamicpropertyoptionsetitem: "dynamicpropertyoptionsetitems", msdyn_agreementbookingproduct: "msdyn_agreementbookingproducts", cardtype: "cardtypes", slaitem: "slaitems", ribboncontextgroup: "ribboncontextgroups", msdyn_incidenttypeservicetask: "msdyn_incidenttypeservicetasks", semiannualfiscalcalendar: "semiannualfiscalcalendars", importfile: "importfiles", msdyn_orderpricelist: "msdyn_orderpricelists", msdyn_characteristicreqforteammember: "msdyn_characteristicreqforteammembers", msdyn_quotelineinvoiceschedule: "msdyn_quotelineinvoiceschedules", businessdatalocalizedlabel: "businessdatalocalizedlabels", sdkmessagefilter: "sdkmessagefilters", msdyn_rmaproduct: "msdyn_rmaproducts", msdyn_opportunitypricelist: "msdyn_opportunitypricelists", appconfigmaster: "appconfigmasters", recommendeddocument: "recommendeddocuments", postregarding: "postregardings", principalattributeaccessmap: "principalattributeaccessmaps", notification: "notifications", owner: "owners", msdyn_rmareceipt: "msdyn_rmareceipts", msdyn_findworkevent: "msdyn_findworkevents", msdyn_bookingtimestamp: "msdyn_bookingtimestamps", msdyn_bpf_baa0a411a239410cb8bded8b5fdd88e3: "msdyn_bpf_baa0a411a239410cb8bded8b5fdd88e3s", entitydatasource: "entitydatasources", sdkmessageprocessingstepsecureconfig: "sdkmessageprocessingstepsecureconfigs", msdyn_fieldservicesystemjob: "msdyn_fieldservicesystemjobs", reportvisibility: "reportvisibilities", msdyn_inventoryadjustmentproduct: "msdyn_inventoryadjustmentproducts", msdyn_bpf_d8f9dc7f099f44db9d641dd81fbd470d: "msdyn_bpf_d8f9dc7f099f44db9d641dd81fbd470ds", traceregarding: "traceregardings", salesliteratureitem: "salesliteratureitems", kbarticlecomment: "kbarticlecomments", msdyn_rtvsubstatus: "msdyn_rtvsubstatuses", theme: "themes", channelaccessprofileruleitem: "channelaccessprofileruleitems", columnmapping: "columnmappings", msdyn_purchaseordersubstatus: "msdyn_purchaseordersubstatuses", exchangesyncidmapping: "exchangesyncidmappings", subscriptiontrackingdeletedobject: "subscriptiontrackingdeletedobjects", msdyn_agreement: "msdyn_agreements", navigationsetting: "navigationsettings", msdyn_systemuserschedulersetting: "msdyn_systemuserschedulersettings", msdyn_priority: "msdyn_priorities", msdyn_estimateline: "msdyn_estimatelines", pricelevel: "pricelevels", emailsearch: "emailsearches", msdyn_postruleconfig: "msdyn_postruleconfigs", msdyn_bookingsetupmetadata: "msdyn_bookingsetupmetadatas", service: "services", actioncarduserstate: "actioncarduserstates", msdyn_quoteinvoicingsetup: "msdyn_quoteinvoicingsetups", import: "imports", monthlyfiscalcalendar: "monthlyfiscalcalendars", metadatadifference: "metadatadifferences", externalpartyitem: "externalpartyitems", dependencynode: "dependencynodes", sharepointdata: "sharepointdata", msdyn_paymentterm: "msdyn_paymentterms", msdyn_bpf_665e73aa18c247d886bfc50499c73b82: "msdyn_bpf_665e73aa18c247d886bfc50499c73b82s", orderclose: "ordercloses", runtimedependency: "runtimedependencies", hierarchyrule: "hierarchyrules", userfiscalcalendar: "userfiscalcalendars", slakpiinstance: "slakpiinstances", category: "categories ", msdyn_quotelinetransaction: "msdyn_quotelinetransactions", msdyn_rtv: "msdyn_rtvs", appointment: "appointments", multientitysearch: "multientitysearches", msdyn_integrationjobdetail: "msdyn_integrationjobdetails", emailsignature: "emailsignatures", connectionrole: "connectionroles", quote: "quotes", annotation: "annotations", documenttemplate: "documenttemplates", externalparty: "externalparties", channelproperty: "channelproperties", entitlementchannel: "entitlementchannels", msdyn_transactiontype: "msdyn_transactiontypes", msdc_colorformconfig: "msdc_colorformconfigs", delveactionhub: "delveactionhubs", post: "posts", queueitem: "queueitems", msdyn_schedulingparameter: "msdyn_schedulingparameters", competitor: "competitors", recurrencerule: "recurrencerules", bookableresourcebookingheader: "bookableresourcebookingheader", userentityinstancedata: "userentityinstancedatas", systemuserprincipals: "systemuserprincipalses", site: "sites", msdyn_quotelinescheduleofvalue: "msdyn_quotelinescheduleofvalues", msdynsm_marketingsitemap: "msdynsm_marketingsitemaps", msdyn_taxcode: "msdyn_taxcodes", serviceappointment: "serviceappointments", msdyn_projectteammembersignup: "msdyn_projectteammembersignups", teamtemplate: "teamtemplates", syncattributemappingprofile: "syncattributemappingprofiles", languagelocale: "languagelocales", businessprocessflowinstance: "businessprocessflowinstances", untrackedemail: "untrackedemails", discounttype: "discounttypes", resourcegroupexpansion: "resourcegroupexpansions", timezonelocalizedname: "timezonelocalizednames", msdyn_transactioncategorypricelevel: "msdyn_transactioncategorypricelevels", timestampdatemapping: "timestampdatemappings", entitlementtemplatechannel: "entitlementtemplatechannels", sharepointdocumentlocation: "sharepointdocumentlocations", msdyn_agreementbookingincident: "msdyn_agreementbookingincidents", timezonerule: "timezonerules", productsubstitute: "productsubstitutes", processtrigger: "processtriggers", msdyn_workorderresourcerestriction: "msdyn_workorderresourcerestrictions", multiselectattributeoptionvalues: "multiselectattributeoptionvaluescollection", list: "lists", bookableresourcebooking: "bookableresourcebooking", msdyn_projecttaskstatususer: "msdyn_projecttaskstatususers", contracttemplate: "contracttemplates", msdyn_projecttaskdependency: "msdyn_projecttaskdependencies", msdyn_workorderservice: "msdyn_workorderservices", wizardpage: "wizardpages", msdyn_timegroup: "msdyn_timegroups", msdyn_bookingalertstatus: "msdyn_bookingalertstatuses", msdyn_resourcerequest: "msdyn_resourcerequests", personaldocumenttemplate: "personaldocumenttemplates", dynamicpropertyassociation: "dynamicpropertyassociations", relationshiprole: "relationshiproles", plugintypestatistic: "plugintypestatistics", productpricelevel: "productpricelevels", msdyn_projecttask: "msdyn_projecttasks", msdyn_project: "msdyn_projects", workflowdependency: "workflowdependencies", msdyn_payment: "msdyn_payments", knowledgearticleincident: "knowledgearticleincidents", msdyn_requirementcharacteristic: "msdyn_requirementcharacteristics", salesorder: "salesorders", bulkdeleteoperation: "bulkdeleteoperations", publisher: "publishers", msdyn_expensecategory: "msdyn_expensecategories", subscriptionmanuallytrackedobject: "subscriptionmanuallytrackedobjects", msdyn_dataexport: "msdyn_dataexports", msdyn_workordercharacteristic: "msdyn_workordercharacteristics", msdyn_agreementsubstatus: "msdyn_agreementsubstatuses", actioncardusersettings: "actioncardusersettingses", commitment: "commitments", expanderevent: "expanderevents", msdyn_bookingchange: "msdyn_bookingchanges", msdyn_actual: "msdyn_actuals", workflowlog: "workflowlogs", msdyn_opportunitylineresourcecategory: "msdyn_opportunitylineresourcecategories", license: "licenses", msdyn_fieldservicepricelistitem: "msdyn_fieldservicepricelistitems", msdyn_resourcerequirement: "msdyn_resourcerequirements", msdyn_bpf_d3d97bac8c294105840e99e37a9d1c39: "msdyn_bpf_d3d97bac8c294105840e99e37a9d1c39s", discount: "discounts", msdyn_contractlineinvoiceschedule: "msdyn_contractlineinvoiceschedules", customcontroldefaultconfig: "customcontroldefaultconfigs", webwizard: "webwizards", msdyn_projecttransactioncategory: "msdyn_projecttransactioncategories", msdyn_contractlinescheduleofvalue: "msdyn_contractlinescheduleofvalues", msdynsm_settingssitemap: "msdynsm_settingssitemaps", feedback: "feedback", documentindex: "documentindexes", msdyn_projectparameter: "msdyn_projectparameters", msdyn_resourceterritory: "msdyn_resourceterritories", socialprofile: "socialprofiles", traceassociation: "traceassociations", tracelog: "tracelogs", msdyn_quotebookingsetup: "msdyn_quotebookingsetups", roletemplate: "roletemplates", msdyn_journal: "msdyn_journals", ribboncommand: "ribboncommands", invoicedetail: "invoicedetails", msdyn_purchaseorderreceiptproduct: "msdyn_purchaseorderreceiptproducts", authorizationserver: "authorizationservers", duplicaterule: "duplicaterules", bookableresourcebookingexchangesyncidmapping: "bookableresourcebookingexchangesyncidmappings", serviceendpoint: "serviceendpoints", dependency: "dependency", privilege: "privileges", mobileofflineprofile: "mobileofflineprofiles", msdyn_processnotes: "msdyn_processnoteses", complexcontrol: "complexcontrols", reportlink: "reportlinks", msdyn_integrationjob: "msdyn_integrationjobs", systemapplicationmetadata: "systemapplicationmetadatacollection", processstage: "processstages", workflowwaitsubscription: "workflowwaitsubscriptions", entitymap: "entitymaps", sharepointsite: "sharepointsites", subscriptionsyncentryoutlook: "subscriptionsyncentriesoutlook", clientupdate: "clientupdates", quoteclose: "quotecloses", subscriptionstatisticsoffline: "subscriptionstatisticsoffline", internaladdress: "internaladdresses", msdyn_orderlinetransactioncategory: "msdyn_orderlinetransactioncategories", phonetocaseprocess: "phonetocaseprocesses", phonecall: "phonecalls", contract: "contracts", channelpropertygroup: "channelpropertygroups", msdyn_rmareceiptproduct: "msdyn_rmareceiptproducts" };
var isValidXml = false;
var isNameModified = false;



if (localStorage.getItem("orgURL") !== null)
    orgURL.value = localStorage.getItem("orgURL");

testButton.onclick = function () {
    fetchXmlOnchange();
    var message = "";
    if (!isValidURL(orgURL.value) || orgURL.value === null)
        message += "Please enter a valid URL. ";
    if (!isValidXml)
        message += "Please enter valid fetchXml. "

    if (message.length == 0) {
        document.querySelector("#finalURI").href = finalLink;
        requestURI.value = finalLink;
        document.querySelector("#finalURI").click();
    } else {
        alert(message);
    }
}

orgURL.onchange = function () {
    if (orgURL.value.length === 0)
        return;
    if (isValidURL(orgURL.value)) {
        localStorage.setItem("orgURL", orgURL.value);
        var url = new URL(orgURL.value);
        orgURL.value = url.origin;
        combine();
    } else {
        alert("Please enter a valid URL.");
    }
};



fetchXmlOnchange = function () {
    if (editor.getCode().length === 0) {
        isNameModified = false;
        return;
    }
    var xml = parseXml(editor.getCode());
    if (!isNameModified) {
        setPluralFromXml(xml);
    }
    combine();
};

//fetchXml.onmouseout = function () {
//    fetchXml.onchange();
//}

plural.onchange = function () {
    pluralName = plural.value;
    isNameModified = true;
    combine();
};

queryName.onkeyup = function () {
    document.title = "fX:" + queryName.value;
}

function combine() {
    finalLink = orgURL.value + apiVersion + pluralName + "?fetchXml=" + editor.getCode();
    document.querySelector("#finalURI").href = finalLink;
}

function setPluralFromXml(xml) {
    try {
        var entityTag = xml.getElementsByTagName("entity");
        var entityName = entityTag[0].getAttribute("name").toLowerCase();
        pluralName = plurals[entityName];
        if (pluralName != undefined) {
            plural.value = pluralName;
        }
        else {
            if (entityName.endsWith("s")) {
                plural.value = entityName + "es";
                pluralName = entityName + "es";
            } else if (entityName.endsWith("y")) {
                entityName = entityName.slice(0, -1);
                plural.value = entityName + "ies";
                pluralName = entityName + "ies";
            } else {
                plural.value = entityName + "s";
                pluralName = entityName + "s";
            }
        }
    } catch (err) {
        isValidXml = false;
        alert("Seems like invalid fetchXml, Please verify!");
    }
}

function parseXml(fetchXml) {
    try {
        var parser = new DOMParser();
        var parsedXml = parser.parseFromString(fetchXml, "text/xml");
        isValidXml = true;
        return parsedXml;
    } catch (err) {
        isValidXml = false
        alert("fetchXml entered in invalid : " + err.message);
    }
}

function isValidURL(str) {
    regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(str)) {
        return true;
    }
    else {
        return false;
    }
}

function copied() {
    this.parentElement.dataset.balloon = "Copied!";
};

function restoreCopied() {
    this.parentElement.dataset.balloon = "Generated Requested URI, Click to Copy.";
};

requestURI.onclick = copied;
requestURI.onmouseout = restoreCopied;

const downloadToFile = (content, filename, contentType) => {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });

    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();

    URL.revokeObjectURL(a.href);
};

document.querySelector('#save').addEventListener('click', () => {
    var fileName = "fetchXml-AshV.xml";
    if (queryName.value !== null && queryName.value.length > 0) {

        if (queryName.value.endsWith(".xml") || queryName.value.endsWith(".txt"))
            fileName = queryName.value;
        else
            fileName = queryName.value + ".xml"
    }
    downloadToFile(editor.getCode(), fileName, 'text/plain');
});