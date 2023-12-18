//@ui5-bundle meg/workorder/Component-preload.js
sap.ui.require.preload({
	"meg/workorder/Component.js":function(){
sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","meg/workorder/model/models"],function(e,t,i){"use strict";return e.extend("meg.workorder.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(i.createDeviceModel(),"device")}})});
},
	"meg/workorder/controller/App.controller.js":function(){
sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("meg.workorder.controller.App",{onInit:function(){}})});
},
	"meg/workorder/controller/ObjectPage.controller.js":function(){
sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","sap/ui/core/Fragment","sap/ui/model/Filter","sap/ui/model/FilterOperator","meg/workorder/utils/CallUtil","sap/m/MessageBox"],function(e,t,r,a,o,i,s){"use strict";return e.extend("meg.workorder.controller.ObjectPage",{onInit:async function(){this.localModel=this.getOwnerComponent().getModel("localModel");var e=this.getOwnerComponent().getRouter();e.getRoute("RouteObjectPage").attachPatternMatched(this._onObjectMatched,this)},_onObjectMatched:async function(e){this.WorkOrderId=e.getParameter("arguments").id;this.serviceUrl=this.getOwnerComponent().getModel("WorkOrderModel").sServiceUrl;var t="?$filter=WorkOrder eq '"+this.WorkOrderId+"'";var r="&$expand=OrdOperationNav,EquipBOMItemNav,AddPartItemNav";var a=await i.callGetData(this.serviceUrl+"/ZUSPPMEG01_WORK_ORDER_HEADERSet"+t+r+"&$format=json"+"&sap-client=410");var o,s,l;if(a&&a.d.results.length>0){a=a.d.results[0];this.localModel.setProperty("/workOrderHeader",a);if(a&&a.OrdOperationNav){o=a.OrdOperationNav.results}if(a&&a.EquipBOMItemNav){this.getEquipBOMData(a.EquipBOMItemNav.results)}if(a&&a.AddPartItemNav){l=a.AddPartItemNav.results}}this.localModel.setProperty("/orderOperations",o);this.localModel.setProperty("/AddPartsItems",l)},getEquipBOMData:async function(e){var t=this.getView().byId("equiBOMID");t.setShowOverlay(true);t.removeSelections(true);var r=this.serviceUrl;var a=this.localModel.getData().workOrderHeader.Plant;let o=0;for(o=0;o<e.length;o++){var s=e[o].Part;var l=await i.callGetData(r+"/ZUSPPMEG01_MATERIAL_STORAGE_LOCATIONSet?$filter=Part eq '"+s+"' and Plant eq '"+a+"'&$format=json"+"&sap-client=410");if(l&&l.d&&l.d.results){e[o].StorageLocation=l.d.results;if(l.d.results.length>1){e[o].isEnabled=true;e[o].isSelected=false}else{e[o].isEnabled=false;e[o].isSelected=true}}}this.localModel.setProperty("/equipBOMItems",e);t.setShowOverlay(false)},onAddPartValueHelp:async function(e){var t=e.getSource().oPropagatedProperties.oBindingContexts.localModel.sPath;this.valueHelpIndex=t.split("/")[2];if(!this._oDialogAddPart){this._oDialogAddPart=sap.ui.xmlfragment("meg.workorder.fragments.AdditionalPart",this);this.getView().addDependent(this._oDialogAddPart);this.VHID="WorkOrder";var r=await i.callGetData(this.serviceUrl+"/ZUSPPMEG01_PART_F4Set?$format=json");r=r.d.results;this.localModel.setProperty("/ZUSPPMEG01_PART_F4Set",r);this._oDialogAddPart.open()}this._oDialogAddPart.open()},onRowAddParts:function(){var e=this.localModel.getData();var t={Part:"",PartDesc:"",DesiredQuan:"",Operation:"",StorageLocation:"",isEnabled:false,isSelected:true};e.AddPartsItems.push(t);this.localModel.refresh()},onTableRowDelete:function(e){var t=e.getSource().oPropagatedProperties.oBindingContexts.localModel.sPath;var r=t.split("/")[2];var a=this.localModel.getData().AddPartsItems;a.splice(r,1);this.localModel.refresh()},handlePartConfirm:async function(e){var t=e.getParameter("selectedItem").getTitle();var r=e.getParameter("selectedItem").getDescription();var a=this.localModel.getData().workOrderHeader.Plant;var o=this.localModel.getData().AddPartsItems;var s=await i.callGetData(this.serviceUrl+"/ZUSPPMEG01_MATERIAL_STORAGE_LOCATIONSet?$filter=Part eq '"+t+"' and Plant eq '"+a+"'&$format=json"+"&sap-client=410");o[this.valueHelpIndex].Part=t;o[this.valueHelpIndex].PartDesc=r;o[this.valueHelpIndex].isEnabled=r;if(s&&s.d&&s.d.results){o[this.valueHelpIndex].StorageLocation=s.d.results;if(s.d.results.length>1){o[this.valueHelpIndex].isEnabled=true;o[this.valueHelpIndex].isSelected=false}else{o[this.valueHelpIndex].isEnabled=false;o[this.valueHelpIndex].isSelected=true}}this.localModel.refresh()},onValueHelpSearch:function(e){var t=e.getParameter("value");var r=new a("Part",o.Contains,t);var i=e.getParameter("itemsBinding");i.filter([r])},passWOReservation:async function(e){var t=this.byId("equiBOMID");var r=t.getSelectedContextPaths();var a=this.localModel.getData();this.localModel.setProperty("/selectedEquiBOM",[]);var o=this.serviceUrl+"/ZUSPPMEG01_WORK_ORDER_HEADERSet";if(r&&r.length>0){r.forEach(function(e){var t=e.split("/")[2];var r=a.equipBOMItems[t];if(a.equipBOMItems[t].DesiredQuan==""){}if(a.equipBOMItems[t].Operation==""){}r={WorkOrder:r.WorkOrder,Part:r.Part,PartDesc:r.PartDesc,BOMQuan:r.BOMQuan,DesiredQuan:r.DesiredQuan,Operation:r.Operation,Select:r.Select,StorageLocation:r.StorageLocation.StorageLocation};a.selectedEquiBOM.push(r)})}if(a.orderOperations){a.orderOperations.forEach(function(e){delete e.__metadata;delete e.Status})}if(a.AddPartsItems){a.AddPartsItems.forEach(function(e){e.WorkOrder=a.workOrderHeader.WorkOrder;delete e.isEnabled;delete e.isSelected;if(e.StorageLocation){e.StorageLocation=e.StorageLocation.StorageLocation}})}var l=true;if(a.selectedEquiBOM){a.selectedEquiBOM.forEach(function(e){if(e.DesiredQuan==""||e.Operation==""){l=false}})}if(a.AddPartsItems){a.AddPartsItems.forEach(function(e){if(e.DesiredQuan==""||e.Operation==""){l=false}})}if(!l){s.warning("PLEASE ENTER THE DESIRED QUANTITY AND OPERATION FOR THE SELECTED ITEMS"),{styleClass:"alignCenter"};return}var d={WorkOrder:a.workOrderHeader.WorkOrder,Plant:a.workOrderHeader.Plant,OrderType:a.workOrderHeader.OrderType,Description:a.workOrderHeader.Description,PlannerGroup:a.workOrderHeader.PlannerGroup,WorkCenter:a.workOrderHeader.WorkCenter,FunctLocation:a.workOrderHeader.FunctLocation,Equipment:a.workOrderHeader.Equipment,OrdOperationNav:a.orderOperations,EquipBOMItemNav:a.selectedEquiBOM,AddPartItemNav:a.AddPartsItems,LogNav:[{}]};var n=await i.callPostData(o,d);console.log(n)},onBomItemSel:function(e){var t=e.getParameter("selected");var r=e.getParameter("listItem").getBindingContextPath();var a=r.split("/")[2];var o=this.localModel.getData().equipBOMItems[a];if(o.DesiredQuan==""){o.DesiredQuan=o.BOMQuan}else{o.DesiredQuan=""}}})});
},
	"meg/workorder/controller/WorkOrder.controller.js":function(){
sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","sap/ui/core/Fragment","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/Token","meg/workorder/utils/FilterUtil","meg/workorder/utils/CallUtil","sap/ui/model/FilterType"],function(e,t,r,o,a,i,n,l,s){"use strict";return e.extend("meg.workorder.controller.WorkOrder",{onInit:async function(){var e=new Date;var t=n.getFormattedDate(e);e.setDate(e.getDate()-30);var r=n.getFormattedDate(e);this.dateFilter="(Date ge '"+r+"' and Date le '"+t+"')";this.localModel=this.getOwnerComponent().getModel("localModel");this.WorkOrderModel=this.getOwnerComponent().getModel("WorkOrderModel");this.serviceUrl=this.WorkOrderModel.sServiceUrl;var o=await l.callGetData(this.serviceUrl+"/ZUSPPMEG01_WORK_ORDER_HEADERSet?$format=json&$filter="+this.dateFilter);o=o.d.results;this.localModel.setProperty("/workOrderList",o);this.oTable=this.getView().byId("workOrderTable")},onTableItemPress:function(e){var t=e.getSource().getBindingContextPath();var r=t.split("/")[1];var o=t.split("/")[2];var a=this.getView().getModel("localModel").getData()[r][o];var i=a.WorkOrder;var n=this.getOwnerComponent().getRouter();n.navTo("RouteObjectPage",{id:i})},handleValueHelpConfirm:function(e){var t=e.getParameters().id;var r=this.getInputId(t);var o=e.getParameter("selectedItems"),a=this.byId(r);if(o&&o.length>0){o.forEach(function(e){a.addToken(new i({text:e.getTitle()}))})}},getInputId:function(e){if(e=="workOrderVH"){return"woInput"}if(e=="plantVH"){return"plantInput"}if(e=="orderTypeVH"){return"orderTypeInput"}if(e=="plannerGroupVH"){return"plannerGroupInput"}if(e=="workCenterVH"){return"workCenterInput"}if(e=="funcLocVH"){return"funLocInput"}if(e=="equipmentVH"){return"equipmentInput"}},onResetFilters:function(){this.byId("woInput").setValue("");this.byId("fromDate").setValue("");this.byId("toDate").setValue("");this.byId("woInput").removeAllTokens();this.byId("plantInput").removeAllTokens();this.byId("plantInput").setValue("");this.byId("orderTypeInput").removeAllTokens();this.byId("orderTypeInput").setValue("");this.byId("plannerGroupInput").removeAllTokens();this.byId("plannerGroupInput").setValue("");this.byId("workCenterInput").removeAllTokens();this.byId("workCenterInput").setValue("");this.byId("funLocInput").removeAllTokens();this.byId("funLocInput").setValue("");this.byId("equipmentInput").removeAllTokens();this.byId("equipmentInput").setValue("")},onWOValueHelp:async function(e){if(!this._oDialogWO){this._oDialogWO=sap.ui.xmlfragment("meg.workorder.fragments.WorkOrder",this);this.getView().addDependent(this._oDialogWO);this.VHID="WorkOrder";var t=await l.callGetData(this.serviceUrl+"/ZUSPPMEG01_WORK_ORDER_F4Set?$format=json");t=t.d.results;this.localModel.setProperty("/ZUSPPMEG01_WORK_ORDER_F4Set",t);this.byId("woInput").setValue("");this._oDialogWO.open()}this.byId("woInput").setValue("");this.byId("woInput").removeAllTokens();this.VHID="WorkOrder";this._oDialogWO.open()},onPlantValueHelp:async function(e){if(!this._oDialogPlant){this._oDialogPlant=sap.ui.xmlfragment("meg.workorder.fragments.Plant",this);this.getView().addDependent(this._oDialogPlant);this.VHID="Plant";var t=await l.callGetData(this.serviceUrl+"/ZUSPPMEG01_PLANT_F4Set?$format=json");t=t.d.results;this.localModel.setProperty("/ZUSPPMEG01_PLANT_F4Set",t);this.byId("plantInput").setValue("");this._oDialogPlant.open()}this.byId("plantInput").setValue("");this.byId("plantInput").removeAllTokens();this.VHID="Plant";this._oDialogPlant.open()},onOrderTypeValueHelp:async function(e){if(!this._oDialogOrderType){this._oDialogOrderType=sap.ui.xmlfragment("meg.workorder.fragments.OrderType",this);this.getView().addDependent(this._oDialogOrderType);this.VHID="OrderType";var t=await l.callGetData(this.serviceUrl+"/ZUSPPMEG01_ORDER_TYPE_F4Set?$format=json");t=t.d.results;this.localModel.setProperty("/ZUSPPMEG01_ORDER_TYPE_F4Set",t);this.byId("orderTypeInput").setValue("");this._oDialogOrderType.open()}this.byId("orderTypeInput").setValue("");this.byId("orderTypeInput").removeAllTokens();this.VHID="OrderType";this._oDialogOrderType.open()},onPlannerGroupValueHelp:async function(e){if(!this._oDialogPlannerGroup){this._oDialogPlannerGroup=sap.ui.xmlfragment("meg.workorder.fragments.PlannerGroup",this);this.getView().addDependent(this._oDialogPlannerGroup);this.VHID="PlannerGroup";var t=await l.callGetData(this.serviceUrl+"/ZUSPPMEG01_PLANNER_GROUP_F4Set?$format=json");t=t.d.results;this.localModel.setProperty("/ZUSPPMEG01_PLANNER_GROUP_F4Set",t);this.byId("plannerGroupInput").setValue("");this._oDialogPlannerGroup.open()}this.byId("plannerGroupInput").setValue("");this.byId("plannerGroupInput").removeAllTokens();this.VHID="PlannerGroup";this._oDialogPlannerGroup.open()},onWorkCenterValueHelp:async function(e){if(!this._oDialogWorkCenter){this._oDialogWorkCenter=sap.ui.xmlfragment("meg.workorder.fragments.WorkCenter",this);this.getView().addDependent(this._oDialogWorkCenter);this.VHID="WorkCenter";var t=await l.callGetData(this.serviceUrl+"/ZUSPPMEG01_WORK_CENTER_F4Set?$format=json");t=t.d.results;this.localModel.setProperty("/ZUSPPMEG01_WORK_CENTER_F4Set",t);this.byId("workCenterInput").setValue("");this._oDialogWorkCenter.open()}this.byId("workCenterInput").setValue("");this.byId("workCenterInput").removeAllTokens();this.VHID="WorkCenter";this._oDialogWorkCenter.open()},onFuncLocValueHelp:async function(e){if(!this._oDialogFuncLoc){this._oDialogFuncLoc=sap.ui.xmlfragment("meg.workorder.fragments.FuncLoc",this);this.getView().addDependent(this._oDialogFuncLoc);this.VHID="FunctLocation";var t=await l.callGetData(this.serviceUrl+"/ZUSPPMEG01_FUNCTION_LOCATION_F4Set?$format=json");t=t.d.results;this.localModel.setProperty("/ZUSPPMEG01_FUNCTION_LOCATION_F4Set",t);this.byId("funLocInput").setValue("");this._oDialogFuncLoc.open()}this.byId("funLocInput").setValue("");this.byId("funLocInput").removeAllTokens();this.VHID="FunctLocation";this._oDialogFuncLoc.open()},onEquipmentValueHelp:async function(e){if(!this._oDialogEquipment){this._oDialogEquipment=sap.ui.xmlfragment("meg.workorder.fragments.Equipment",this);this.getView().addDependent(this._oDialogEquipment);this.VHID="Equipment";var t=await l.callGetData(this.serviceUrl+"/ZUSPPMEG01_EQUIPMENT_F4Set?$format=json");t=t.d.results;this.localModel.setProperty("/ZUSPPMEG01_EQUIPMENT_F4Set",t);this.byId("equipmentInput").setValue("");this._oDialogEquipment.open()}this.byId("equipmentInput").setValue("");this.byId("equipmentInput").removeAllTokens();this.VHID="Equipment";this._oDialogEquipment.open()},onFilterSearch:async function(){this.oTable.setShowOverlay(true);var e=this.byId("woInput").getProperty("value");var t=this.byId("plantInput").getProperty("value");var r=this.byId("orderTypeInput").getProperty("value");var o=this.byId("plannerGroupInput").getProperty("value");var a=this.byId("workCenterInput").getProperty("value");var i=this.byId("funLocInput").getProperty("value");var s=this.byId("equipmentInput").getProperty("value");var u=this.byId("fromDate").getDateValue();var p=this.byId("toDate").getDateValue();var d=this.getView().byId("FilterBar");var h=d.getFilterGroupItems().reduce(function(e,t){var r=t.getControl();if(r._tokenizer){var o=r._tokenizer.getAggregation("tokens")}var a=t.getName(),i="";if(o&&o.length>1){i="(";o.map(function(e){if(o.length!=o.length>1)i+=a+" eq '"+e.getText()+"' or "});i=i.slice(0,-4);i+=")"}else if(o&&o.length==1){i=a+" eq '"+o[0].getText()+"'"}if(i&&i!==""){e.push(i)}return e},[]);var g=n.prepareFilters(h);if(e!=""){if(g==""){g+="WorkOrder eq '"+e+"'"}else{g+=" and WorkOrder eq '"+e+"'"}}if(t!=""){if(g==""){g+="Plant eq '"+t+"'"}else{g+=" and Plant eq '"+t+"'"}}if(r!=""){if(g==""){g+="OrderType eq '"+r+"'"}else{g+=" and OrderType eq '"+r+"'"}}if(o!=""){if(g==""){g+="PlannerGroup eq '"+o+"'"}else{g+=" and PlannerGroup eq '"+o+"'"}}if(a!=""){if(g==""){g+="WorkCenter eq '"+a+"'"}else{g+=" and WorkCenter eq '"+a+"'"}}if(i!=""){if(g==""){g+="FunctLocation eq '"+i+"'"}else{g+=" and FunctLocation eq '"+i+"'"}}if(s!=""){if(g==""){g+="Equipment eq '"+s+"'"}else{g+=" and Equipment eq '"+s+"'"}}if(u&&p){if(g!=""){g+=" and "}u=n.getFormattedDate(u);p=n.getFormattedDate(p);this.dateFilter="(Date ge '"+u+"'"+" and Date le '"+p+"')"}else if(u){if(g!=""){g+=" and "}u=n.getFormattedDate(u);this.dateFilter="Date ge '"+u+"'"}else if(p){if(g!=""){g+=" and "}p=n.getFormattedDate(p);this.dateFilter="Date le '"+p+"'"}else{this.dateFilter=""}if(g==""&&this.dateFilter==""){var I=new Date;var m=n.getFormattedDate(I);I.setDate(I.getDate()-30);var c=n.getFormattedDate(I);this.dateFilter="(Date ge '"+c+"' and Date le '"+m+"')"}var D=await l.callGetData(this.serviceUrl+"/ZUSPPMEG01_WORK_ORDER_HEADERSet?$format=json&$filter="+g+this.dateFilter);D=D.d.results;this.localModel.setProperty("/workOrderList",D);this.oTable.setShowOverlay(false)},onValueHelpSearch:function(e){var t=e.getParameter("value");var r=new o(this.VHID,a.Contains,t);var i=e.getParameter("itemsBinding");i.filter([r])}})});
},
	"meg/workorder/fragments/AdditionalPart.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\n    xmlns:core="sap.ui.core"><SelectDialog id="addPartVH" title="Part" items="{localModel>/ZUSPPMEG01_PART_F4Set}" search=".onValueHelpSearch" confirm="handlePartConfirm" cancel=".onValueHelpClose"><StandardListItem title="{localModel>Part}" description="{localModel>Description}" /></SelectDialog></core:FragmentDefinition>',
	"meg/workorder/fragments/Equipment.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\n\txmlns:core="sap.ui.core"><SelectDialog id="equipmentVH" title="Equipment" items="{localModel>/ZUSPPMEG01_EQUIPMENT_F4Set}" search=".onValueHelpSearch" confirm="handleValueHelpConfirm" cancel=".onValueHelpClose" multiSelect="true" rememberSelections="true"><StandardListItem title="{localModel>Equipment}" description="{localModel>Description}" /></SelectDialog></core:FragmentDefinition>',
	"meg/workorder/fragments/FuncLoc.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\n\txmlns:core="sap.ui.core"><SelectDialog id="funcLocVH" title="Func Loc" items="{localModel>/ZUSPPMEG01_FUNCTION_LOCATION_F4Set}" search=".onValueHelpSearch" confirm="handleValueHelpConfirm" cancel=".onValueHelpClose" multiSelect="true" rememberSelections="true"><StandardListItem title="{localModel>FunctLocation}" description="{localModel>Description}" /></SelectDialog></core:FragmentDefinition>',
	"meg/workorder/fragments/OrderType.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\n\txmlns:core="sap.ui.core"><SelectDialog id="orderTypeVH" title="Order Type" items="{localModel>/ZUSPPMEG01_ORDER_TYPE_F4Set}" search=".onValueHelpSearch" confirm="handleValueHelpConfirm" cancel=".onValueHelpClose" multiSelect="true" rememberSelections="true"><StandardListItem title="{localModel>OrderType}" description="{localModel>Description}" /></SelectDialog></core:FragmentDefinition>',
	"meg/workorder/fragments/PlannerGroup.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\n\txmlns:core="sap.ui.core"><SelectDialog id="plannerGroupVH" title="Planner Group" items="{localModel>/ZUSPPMEG01_PLANNER_GROUP_F4Set}" search=".onValueHelpSearch" confirm="handleValueHelpConfirm" cancel=".onValueHelpClose" multiSelect="true" rememberSelections="true"><StandardListItem title="{localModel>PlannerGroup}" description="{localModel>Description}" /></SelectDialog></core:FragmentDefinition>',
	"meg/workorder/fragments/Plant.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\n\txmlns:core="sap.ui.core"><SelectDialog id="plantVH" title="Plant" items="{localModel>/ZUSPPMEG01_PLANT_F4Set}" search=".onValueHelpSearch" confirm="handleValueHelpConfirm" cancel=".onValueHelpClose" multiSelect="true" rememberSelections="true"><StandardListItem title="{localModel>Plant}" description="{localModel>Description}" /></SelectDialog></core:FragmentDefinition>\n\n',
	"meg/workorder/fragments/WorkCenter.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\n\txmlns:core="sap.ui.core"><SelectDialog id="workCenterVH" title="Work Center" items="{localModel>/ZUSPPMEG01_WORK_CENTER_F4Set}" search=".onValueHelpSearch" confirm="handleValueHelpConfirm" cancel=".onValueHelpClose" multiSelect="true" rememberSelections="true"><StandardListItem title="{localModel>WorkCenter}" description="{localModel>Description}" /></SelectDialog></core:FragmentDefinition>',
	"meg/workorder/fragments/WorkOrder.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\n    xmlns:core="sap.ui.core"><SelectDialog id="workOrderVH" rememberSelections="true" title="Work Order" items="{localModel>/ZUSPPMEG01_WORK_ORDER_F4Set}" search=".onValueHelpSearch" confirm="handleValueHelpConfirm" cancel=".onValueHelpClose" multiSelect="true"><StandardListItem title="{localModel>WorkOrder}" description="{localModel>Description}" /></SelectDialog></core:FragmentDefinition>\n\n\n\n',
	"meg/workorder/i18n/i18n.properties":'# This is the resource bundle for meg.workorder\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Work Order\n\n#YDES: Application description\nappDescription=A Fiori application.\n#XTIT: Main view title\ntitle=Work Order\nWONo=Work Order #',
	"meg/workorder/localService/mockserver.js":function(){
sap.ui.define(["sap/ui/core/util/MockServer","sap/ui/model/json/JSONModel","sap/base/util/UriParameters","sap/base/Log"],function(e,r,t,a){"use strict";var o,i="meg.workorder/",n=i+"localService/mockdata";var s={init:function(s){var u=s||{};return new Promise(function(s,c){var p=sap.ui.require.toUrl(i+"manifest.json"),f=new r(p);f.attachRequestCompleted(function(){var r=new t(window.location.href),c=sap.ui.require.toUrl(n),p=f.getProperty("/sap.app/dataSources/mainService"),l=sap.ui.require.toUrl(i+p.settings.localUri),d=p.uri&&new URI(p.uri).absoluteTo(sap.ui.require.toUrl(i)).toString();if(!o){o=new e({rootUri:d})}else{o.stop()}e.config({autoRespond:true,autoRespondAfter:u.delay||r.get("serverDelay")||500});o.simulate(l,{sMockdataBaseUrl:c,bGenerateMissingMockData:true});var m=o.getRequests();var g=function(e,r,t){t.response=function(t){t.respond(e,{"Content-Type":"text/plain;charset=utf-8"},r)}};if(u.metadataError||r.get("metadataError")){m.forEach(function(e){if(e.path.toString().indexOf("$metadata")>-1){g(500,"metadata Error",e)}})}var v=u.errorType||r.get("errorType"),w=v==="badRequest"?400:500;if(v){m.forEach(function(e){g(w,v,e)})}o.setRequests(m);o.start();a.info("Running the app with mock data");s()});f.attachRequestFailed(function(){var e="Failed to load application manifest";a.error(e);c(new Error(e))})})},getMockServer:function(){return o}};return s});
},
	"meg/workorder/manifest.json":'{"_version":"1.32.0","sap.app":{"id":"meg.workorder","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","dataSources":{"mainService":{"uri":"/sap/opu/odata/SAP/ZUSPPMEGI01_WORK_ORD_APPROVAL_SRV","type":"OData","settings":{"annotations":[],"localUri":"localService/metadata.xml","odataVersion":"2.0"}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"dependencies":{"minUI5Version":"1.120.0","libs":{"sap.ui.core":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"meg.workorder.i18n.i18n"}},"localModel":{"type":"sap.ui.model.json.JSONModel","settings":{},"uri":"./model/data.json","preload":true},"WorkOrderModel":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true,"groupId":"$direct"}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"meg.workorder.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"RouteWorkOrder","pattern":":?query:","target":["TargetWorkOrder"]},{"name":"RouteObjectPage","pattern":"RouteObjectPage/{id}","target":["TargetObjectPage"]}],"targets":{"TargetWorkOrder":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"WorkOrder","viewName":"WorkOrder"},"TargetObjectPage":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"ObjectPage","viewName":"ObjectPage"}}},"rootView":{"viewName":"meg.workorder.view.App","type":"XML","async":true,"id":"App"}}}',
	"meg/workorder/model/models.js":function(){
sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"meg/workorder/utils/CallUtil.js":function(){
sap.ui.define(["sap/m/MessageBox"],function(e){"use strict";return{callGetData:function(e){return new Promise(function(n,s){$.get({"x-csrf-token":fetch,url:e,success:function(e){n(e);sap.ui.core.BusyIndicator.hide()},error:function(e){s(e);sap.ui.core.BusyIndicator.hide()}})})},callPostData:function(n,s){var t="";jQuery.ajax({url:n,type:"GET",accepts:{json:"application/json"},contentType:"application/json",beforeSend:function(e){e.setRequestHeader("Accept","application/json");e.setRequestHeader("X-CSRF-Token","Fetch")},success:function(t,o,r){var a=r.getResponseHeader("X-CSRF-Token");jQuery.ajax({url:n,type:"POST",data:JSON.stringify(s),contentType:"application/json",beforeSend:function(e){e.setRequestHeader("Accept","application/json");e.setRequestHeader("X-CSRF-Token",a)},success:function(n,s,t){var o=n.d.WorkOrder;var r=n.d.LogNav;if(r==null){e.information("NO DATA CHANGED!",{styleClass:"alignCenter"})}else if(r){var a="";r.results.forEach(function(e){if(e.Type=="E"){a+=e.Message+"\n"}});if(a!=""){e.error(a.toUpperCase(),{styleClass:"alignCenter"})}else{e.success("ORDER "+o+" SAVED!",{styleClass:"alignCenter"})}}console.log(n,s,t)},error:function(n){var s=JSON.parse(n.responseText).error.message.value;e.error(s);console.log(n,s)}})}})}}});
},
	"meg/workorder/utils/FilterUtil.js":function(){
sap.ui.define(["sap/ui/model/Filter","sap/ui/model/FilterOperator"],function(t,r){"use strict";return{prepareFilters:function(t){var r="";t.forEach(function(t){r+=t+" and "});r=r.slice(0,-5);return r},getFormattedDate:function(t){var r=String(t.getMonth()+1).padStart(2,"0");var e=String(t.getDate()).padStart(2,"0");var a=t.getFullYear()+""+r+""+e;return a}}});
},
	"meg/workorder/utils/locate-reuse-libs.js":'(function(sap){var e=function(e){var t=e;var n="";var a=["sap.apf","sap.base","sap.chart","sap.collaboration","sap.f","sap.fe","sap.fileviewer","sap.gantt","sap.landvisz","sap.m","sap.ndc","sap.ovp","sap.rules","sap.suite","sap.tnt","sap.ui","sap.uiext","sap.ushell","sap.uxap","sap.viz","sap.webanalytics","sap.zen"];function r(e,t){Object.keys(e).forEach(function(e){if(!a.some(function(t){return e===t||e.startsWith(t+".")})){if(t.length>0){t=t+","+e}else{t=e}}});return t}return new Promise(function(a,i){$.ajax(t).done(function(e){if(e){if(e["sap.ui5"]&&e["sap.ui5"].dependencies){if(e["sap.ui5"].dependencies.libs){n=r(e["sap.ui5"].dependencies.libs,n)}if(e["sap.ui5"].dependencies.components){n=r(e["sap.ui5"].dependencies.components,n)}}if(e["sap.ui5"]&&e["sap.ui5"].componentUsages){n=r(e["sap.ui5"].componentUsages,n)}}a(n)}).fail(function(t){i(new Error("Could not fetch manifest at \'"+e))})})};sap.registerComponentDependencyPaths=function(t){return e(t).then(function(e){if(e&&e.length>0){var t="/sap/bc/ui2/app_index/ui5_app_info?id="+e;var n=jQuery.sap.getUriParameters().get("sap-client");if(n&&n.length===3){t=t+"&sap-client="+n}return $.ajax(t).done(function(e){if(e){Object.keys(e).forEach(function(t){var n=e[t];if(n&&n.dependencies){n.dependencies.forEach(function(e){if(e.url&&e.url.length>0&&e.type==="UI5LIB"){jQuery.sap.log.info("Registering Library "+e.componentId+" from server "+e.url);jQuery.sap.registerModulePath(e.componentId,e.url)}})}})}})}})}})(sap);var scripts=document.getElementsByTagName("script");var currentScript=scripts[scripts.length-1];var manifestUri=currentScript.getAttribute("data-sap-ui-manifest-uri");var componentName=currentScript.getAttribute("data-sap-ui-componentName");var useMockserver=currentScript.getAttribute("data-sap-ui-use-mockserver");sap.registerComponentDependencyPaths(manifestUri).catch(function(e){jQuery.sap.log.error(e)}).finally(function(){sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")});if(componentName&&componentName.length>0){if(useMockserver&&useMockserver==="true"){sap.ui.getCore().attachInit(function(){sap.ui.require([componentName.replace(/\\./g,"/")+"/localService/mockserver"],function(e){e.init();sap.ushell.Container.createRenderer().placeAt("content")})})}else{sap.ui.require(["sap/ui/core/ComponentSupport"]);sap.ui.getCore().attachInit(function(){jQuery.sap.require("jquery.sap.resources");var e=sap.ui.getCore().getConfiguration().getLanguage();var t=jQuery.sap.resources({url:"i18n/i18n.properties",locale:e});document.title=t.getText("appTitle")})}}else{sap.ui.getCore().attachInit(function(){sap.ushell.Container.createRenderer().placeAt("content")})}});sap.registerComponentDependencyPaths(manifestUri);\n',
	"meg/workorder/view/App.view.xml":'<mvc:View controllerName="meg.workorder.controller.App"\n    xmlns:html="http://www.w3.org/1999/xhtml"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns="sap.m"><App id="app"></App></mvc:View>',
	"meg/workorder/view/ObjectPage.view.xml":'<mvc:View controllerName="meg.workorder.controller.ObjectPage"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns="sap.m"\n    xmlns:uxap="sap.uxap"\n    xmlns:core="sap.ui.core"\n    xmlns:l="sap.ui.layout"\n    xmlns:f="sap.ui.layout.form" height="100%"><Page><content><uxap:ObjectPageLayout id="ObjectPageLayout" enableLazyLoading="true" useIconTabBar="false" upperCaseAnchorBar="false"><uxap:headerTitle><uxap:ObjectPageDynamicHeaderTitle><uxap:heading><Title text="Work Order" wrapping="true"/></uxap:heading></uxap:ObjectPageDynamicHeaderTitle></uxap:headerTitle><uxap:headerContent><VBox class="sapUiSmallMargin"><f:SimpleForm id="SimpleFormDisplaywideDual" editable="false" layout="ResponsiveGridLayout" labelSpanXL="4" labelSpanL="4" labelSpanM="4" labelSpanS="12" adjustLabelSpan="false" emptySpanXL="0" emptySpanL="4" emptySpanM="0" emptySpanS="0" columnsXL="2" columnsL="2" columnsM="2" singleContainerFullSize="true"><f:content><core:Title text="" class="title"/><Label text="Work Order #" class="label"/><Text text="{localModel>/workOrderHeader/WorkOrder}" class="text"/><Label text="Plant" class="label"/><Text text="{localModel>/workOrderHeader/Plant}" class="text"/><Label text="Order Type" class="label"/><Text text="{localModel>/workOrderHeader/OrderType}" class="text"/><Label text="Planner Group" class="label"/><Text text="{localModel>/workOrderHeader/PlannerGroup}" class="text"/><core:Title text="" /><Label text="Work Center" class="label"/><Text text="{localModel>/workOrderHeader/WorkCenter}" class="text"/><Label text="Func. Loc" class="label"/><Text text="{localModel>/workOrderHeader/FunctLocation}" class="text" wrapping="false" width="25rem"/><Label text="Equipment" class="label"/><Text text="{localModel>/workOrderHeader/Equipment}" class="text"/></f:content></f:SimpleForm></VBox></uxap:headerContent><uxap:sections><uxap:ObjectPageSection titleUppercase="false" id="orderOpsID" title="Order Operations"><uxap:subSections><uxap:ObjectPageSubSection id="orderOpsID1" title="Order Operations" titleUppercase="false"><uxap:blocks><VBox><Toolbar><ToolbarSpacer /></Toolbar><Table id="orderOpID" items="{path: \'localModel>/orderOperations\'}" width="25rem"><columns><Column width="4rem"></Column><Column width="21rem"></Column></columns><items><ColumnListItem press="onTablePress" vAlign="Middle"><cells><Text text="{localModel>OperationNum}" wrapping="false"/><Text text="{localModel>OperationDesc}" wrapping="false"/></cells></ColumnListItem></items></Table></VBox></uxap:blocks></uxap:ObjectPageSubSection></uxap:subSections></uxap:ObjectPageSection><uxap:ObjectPageSection titleUppercase="false" id="eqipID" title="Equipment BOM Items"><uxap:subSections><uxap:ObjectPageSubSection id="eqipID1" title="Equipment BOM Items" titleUppercase="false"><uxap:blocks><VBox><Table id="equiBOMID" selectionChange=".onBomItemSel" items="{localModel>/equipBOMItems}" mode="MultiSelect"><columns><Column minScreenWidth="Tablet"><Label text="Part"/></Column><Column minScreenWidth="Tablet"><Label text="Part Description"/></Column><Column minScreenWidth="Tablet"><Label text="BOM Quantity"/></Column><Column minScreenWidth="Tablet"><Label text="Desired Quantity"/></Column><Column minScreenWidth="Tablet"><Label text="Operation"/></Column><Column minScreenWidth="Tablet" visible="true"><Label text="Storage Location"/></Column></columns><items><ColumnListItem press="onTablePress" vAlign="Middle"><cells><Text text="{localModel>Part}" wrapping="false"/><Text text="{localModel>PartDesc}" wrapping="false"/><Text text="{localModel>BOMQuan}" wrapping="false"/><Input id="idDesiredQuanBOM" value="{localModel>DesiredQuan}" /><Input type="Number" id="idOperationBOM" change= ".onOperationChange" maxLength="4" value="{localModel>Operation}"/><Select selectedKey="{localModel>StorageLocation/StorageLocation}" enabled="{localModel>isEnabled}" width="100%" forceSelection="{localModel>isSelected}" items="{path: \'localModel>StorageLocation\'}"><core:Item key="{localModel>StorageLocation}" text="{localModel>StorageLocation}" /></Select></cells></ColumnListItem></items></Table></VBox></uxap:blocks></uxap:ObjectPageSubSection></uxap:subSections></uxap:ObjectPageSection><uxap:ObjectPageSection titleUppercase="false" id="addPart" title="Additional Part Items"><uxap:subSections><uxap:ObjectPageSubSection id="addPart1" title="Additional Part Items" titleUppercase="false"><uxap:blocks><VBox><Table id="addPartItemsID" items="{localModel>/AddPartsItems}"><headerToolbar><OverflowToolbar><ToolbarSpacer /><Button text="Add Item" icon="sap-icon://add" press="onRowAddParts" /></OverflowToolbar></headerToolbar><columns><Column minScreenWidth="Tablet"><Label text="Part"/></Column><Column minScreenWidth="Tablet"><Label text="Part Description"/></Column><Column minScreenWidth="Tablet"><Label text="Desired Quantity"/></Column><Column minScreenWidth="Tablet"><Label text="Operation"/></Column><Column minScreenWidth="Tablet"><Label text="Storage Location"/></Column><Column width="1rem"><Label text=""/></Column></columns><items><ColumnListItem press="onTablePress" vAlign="Middle"><cells><Input id="idPart" value="{localModel>Part}" type="Text" showValueHelp="true" valueHelpOnly="false" valueHelpRequest=".onAddPartValueHelp" /><Input value="{localModel>PartDesc}" editable="false" /><Input value="{localModel>DesiredQuan}" /><Input value="{localModel>Operation}" /><Select selectedKey="{localModel>StorageLocation/StorageLocation}" enabled="{localModel>isEnabled}" width="100%" forceSelection="{localModel>isSelected}" items="{path: \'localModel>StorageLocation\'}"><core:Item key="{localModel>StorageLocation}" text="{localModel>StorageLocation}" /></Select><Button icon="sap-icon://delete" press="onTableRowDelete" /></cells></ColumnListItem></items></Table></VBox></uxap:blocks></uxap:ObjectPageSubSection></uxap:subSections></uxap:ObjectPageSection></uxap:sections></uxap:ObjectPageLayout></content><footer><Toolbar><ToolbarSpacer/><Button text="Pass to Work Order Reservation" press="passWOReservation" type="Emphasized"/></Toolbar></footer></Page></mvc:View>\n',
	"meg/workorder/view/WorkOrder.view.xml":'<mvc:View controllerName="meg.workorder.controller.WorkOrder"\n\txmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n\txmlns="sap.m"\n\txmlns:l="sap.ui.layout"\n\txmlns:f="sap.ui.layout.form"\n\txmlns:core="sap.ui.core"\n\txmlns:sapf="sap.f"\n\txmlns:fb="sap.ui.comp.filterbar"\n\txmlns:sfb="sap.ui.comp.smartfilterbar"\n\txmlns:smartTable="sap.ui.comp.smarttable"><Page id="page" title="{i18n>title}"><content><fb:FilterBar id="FilterBar" clear="onResetFilters" reset="onReset" search="onFilterSearch" showRestoreButton="false" showClearButton="false" showClearOnFB="true" filterBarExpanded="true"><fb:filterGroupItems><fb:FilterGroupItem groupName="G1" name="WorkOrder" label="Work Order #" visibleInFilterBar="true"><fb:control><MultiInput id="woInput" items="{localModel>/filterValues/wo}" showValueHelp="true" valueHelpRequest=".onWOValueHelp" valueHelpOnly="false"></MultiInput></fb:control></fb:FilterGroupItem><fb:FilterGroupItem groupName="G1" name="Plant" label="Plant" visibleInFilterBar="true"><fb:control><MultiInput id="plantInput" showValueHelp="true" valueHelpRequest=".onPlantValueHelp" valueHelpOnly="false"/></fb:control></fb:FilterGroupItem><fb:FilterGroupItem groupName="G1" name="OrderType" label="Order Type" visibleInFilterBar="true"><fb:control><MultiInput id="orderTypeInput" showValueHelp="true" valueHelpRequest=".onOrderTypeValueHelp" valueHelpOnly="false" /></fb:control></fb:FilterGroupItem><fb:FilterGroupItem groupName="G1" name="PlannerGroup" label="Planner Group" visibleInFilterBar="true"><fb:control><MultiInput id="plannerGroupInput" showValueHelp="true" valueHelpRequest=".onPlannerGroupValueHelp" valueHelpOnly="false" /></fb:control></fb:FilterGroupItem><fb:FilterGroupItem groupName="G1" name="WorkCenter" label="Work Center" visibleInFilterBar="true"><fb:control><MultiInput id="workCenterInput" showValueHelp="true" valueHelpRequest=".onWorkCenterValueHelp" valueHelpOnly="false" /></fb:control></fb:FilterGroupItem><fb:FilterGroupItem groupName="G1" name="FunctLocation" label="Func Loc" visibleInFilterBar="true"><fb:control><MultiInput id="funLocInput" showValueHelp="true" valueHelpRequest=".onFuncLocValueHelp" valueHelpOnly="false" /></fb:control></fb:FilterGroupItem><fb:FilterGroupItem groupName="G1" name="Equipment" label="Equipment" visibleInFilterBar="true"><fb:control><MultiInput id="equipmentInput" showValueHelp="true" valueHelpRequest=".onEquipmentValueHelp" valueHelpOnly="false" /></fb:control></fb:FilterGroupItem><fb:FilterGroupItem groupName="G1" name="From Date" label="From Date" visibleInFilterBar="true"><fb:control><DatePicker id="fromDate" change="handleChange" valueFormat="yyyy-MM-dd" value="{\'path\': \'\',\'formatOptions\': {\'pattern\': \'dd/MM/y\'}}"/></fb:control></fb:FilterGroupItem><fb:FilterGroupItem groupName="G1" name="To Date" label="To Date" visibleInFilterBar="true"><fb:control><DatePicker id="toDate" change="handleChange" value="{\'type\': \'sap.ui.model.type.Date\',\'formatOptions\': {\'pattern\': \'dd/MM/y\'}}"/></fb:control></fb:FilterGroupItem></fb:filterGroupItems></fb:FilterBar><VBox><Table id="workOrderTable" items="{localModel>/workOrderList}" mode="Navigation"><columns><Column minScreenWidth="Tablet"><Label text="Work Order"/></Column><Column minScreenWidth="Tablet"><Label text="Description"/></Column><Column minScreenWidth="Tablet"><Label text="Plant"/></Column><Column minScreenWidth="Tablet"><Label text="Order Type"/></Column><Column minScreenWidth="Tablet" hAlign="End"><Label text="Planner Group"/></Column><Column minScreenWidth="Tablet" hAlign="End"><Label text="Work Center"/></Column><Column minScreenWidth="Tablet" hAlign="End"><Label text="Func Loc"/></Column><Column minScreenWidth="Tablet" hAlign="End"><Label text="Equipment"/></Column></columns><items><ColumnListItem press="onTableItemPress" vAlign="Middle" type="Navigation"><cells><Text text="{localModel>WorkOrder}" wrapping="false"/><Text text="{localModel>Description}" wrapping="false"/><Text text="{localModel>Plant}" wrapping="false"/><Text text="{localModel>OrderType}" wrapping="false"/><Text text="{localModel>PlannerGroup}" wrapping="false"/><Text text="{localModel>WorkCenter}" wrapping="false"/><Text text="{localModel>FunctLocation}" wrapping="false"/><Text text="{localModel>Equipment}" wrapping="false"/></cells></ColumnListItem></items></Table></VBox></content></Page></mvc:View>\n'
});
//# sourceMappingURL=Component-preload.js.map
