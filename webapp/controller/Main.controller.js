sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, MessageBox) {
        "use strict";
        var that;
        return Controller.extend("com.odatacrudoperations.capodatacrudoperations.controller.Main", {

            onInit: function () {
                that = this;
                that.getData();
                // sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(), "inputModel");


                // var oDataServiceUrl="https://0ce9d9f5trial-dev-bpsh-126-sample-srv.cfapps.us10-001.hana.ondemand.com/v2/catalog/";
                // var odataModel = new sap.ui.model.odata.v2.ODataModel(oDataServiceUrl);

                // this.createDialog = sap.ui.xmlfragment("com.odatacrudoperations.capodatacrudoperations.fragments.create", this);

                // var oDataModel=this.getOwnerComponent().getModel();
                // oDataModel.read("/Interactions_Items",{
                //     success: function (oData) {
                //         // Handle successful read operation
                //         console.log("Data loaded successfully:", oData);
                //     },
                //     error: function (error) {
                //         // Handle error
                //         console.error("Error while loading data:", error);
                //     }
                // })

                //   var oModelData = this.getView().getModel("jTabModel").getData();
                //   console.log("Model Data:", oModelData);

            },


            //--------- fragment open-------------
            OnPressCreateDataButton: function () {
                var oModel = new sap.ui.model.json.JSONModel();
                sap.ui.getCore().setModel(oModel, "inputModel");

                if (!this.createDialog) {
                    this.createDialog = sap.ui.xmlfragment("com.odatacrudoperations.capodatacrudoperations.fragments.create", this);
                }
                sap.ui.getCore().byId("fragmentIdInput").setEnabled(true);
                this.createDialog.getBeginButton().setText("Submit");
                this.createDialog.open();
            },
            getData: function () {
                var oDataModel = this.getOwnerComponent().getModel();
                // this.getView().setBusy(true);
                oDataModel.read("/Interactions_Employee", {
                    success: function (oData) {
                        var jsonModel = new sap.ui.model.json.JSONModel({
                            Interactions_Employee: oData.results
                        });
                        that.getView().byId("table").setModel(jsonModel);
                        // Handle successful read operation
                        // console.log("Data loaded successfully:", oData);
                        that.getView().byId("table").getModel().refresh();
                        that.getView().setBusy(false);
                    },
                    error: function (error) {
                        // Handle error
                        console.error("Error while loading data:", error);
                        that.getView().setBusy(false);
                    }
                })
            },

            //   -------submit button functionality--------------
            SubmitButton: function () {
                var createData = sap.ui.getCore().getModel("inputModel").getData();
                var odataModel = this.getOwnerComponent().getModel();

                // check if it's an update or submit
                var sButtonText = this.createDialog.getBeginButton().getText();
                if (sButtonText === "Submit") {
                    // Submit logic for new entry
                    //    sap.ui.getCore().byId("fragmentIdInput").setEnabled("true");
                    odataModel.create("/Interactions_Employee", createData, {
                        success: function (o) {
                            MessageBox.success("Data created successfully:", o);
                            that.createDialog.close();
                            that.getData();
                        },
                        error: function (error) {
                            MessageBox.error("Error while creating data:", error);
                        }
                    });
                } else if (sButtonText === "Update") {
                    // sap.ui.getCore().byId("fragmentIdInput").setEnabled("flase");
                    var sPath = "/Interactions_Employee(" + createData.ID + ")" // Adjust the path based on your OData service

                    odataModel.update(sPath, createData, {
                        success: function (o) {
                            MessageBox.success("Data updated successfully:", o);
                            that.createDialog.close();

                            // Refresh the table or update the row in the table with the modified data
                            var oTable = that.getView().byId("table");
                            oTable.getModel().refresh();
                        },
                        error: function (error) {
                            MessageBox.error("Error while updating data:", error);
                        }
                    });
                }
            },


            // fragment close
            closeIcon: function () {
                sap.ui.xmlfragment("com.odatacrudoperations.capodatacrudoperations.fragments.create", this);
                that.createDialog.close();

                // that.createDialog.destroy();
            },



            // // ------------Table delete functionality---------------

            onTableDeleteItem: function (oEvent) {
                // var createData=sap.ui.getCore().getModel("inputModel").getData();
                var odataModel = this.getOwnerComponent().getModel();
                // var ID=oEvent.getParameters()['listItem'].getBindingContext().getObject().ID;
                var sObj = oEvent.getSource().getParent().getBindingContext().getObject();

                var sPath = "/Interactions_Employee(" + sObj.ID + ")";
                odataModel.remove(sPath, {
                    success: function (oData) {
                        // Handle successful delete
                        MessageBox.success("data is deleted succssesfully:", oData);
                        that.getData();
                    },
                    error: function (error) {
                        // Handle error
                        MessageBox.error("Error In Data Deletion:", error);
                    }
                });
            },




            // -------------update functionality-------------------
            onUpdateButtonPress: function (oEvent) {

                var oSelectedItem = oEvent.getSource().getParent();
                var oSelectedModel = oSelectedItem.getBindingContext().getObject();
                var oModel = new sap.ui.model.json.JSONModel(oSelectedModel);
                sap.ui.getCore().setModel(oModel, "inputModel");

                if (!this.createDialog) {
                    this.createDialog = sap.ui.xmlfragment("com.odatacrudoperations.capodatacrudoperations.fragments.create", this);
                }
                sap.ui.getCore().byId("fragmentIdInput").setEnabled(false);
                //Change the text of the Submit button to "Update"
                this.createDialog.getBeginButton().setText("Update");

                this.createDialog.open();
            },
            RefreshButton: function () {
                that.inputModel().refresh();
            },










            //--------------  AddBatch contoller-----------
            // --------addFragment Open----------------------
            OnPressAddBatchButton: function () {
                if (!this.addDialog) {
                    this.addDialog = sap.ui.xmlfragment("com.odatacrudoperations.capodatacrudoperations.fragments.addBatch", this);

                }
                var oModel = new sap.ui.model.json.JSONModel({
                    "items": [
                        {
                            "ID": "",
                            "NAME": "",
                            "DOJ": "",
                            "ROLE": "",
                            "COMPANYN": "",
                            "SKILLED": ""
                        },

                    ]
                });
                sap.ui.getCore().byId("batchTable").setModel(oModel, "jTabModel");

                this.addDialog.open();
            },
            // --------fragment close button-------
            onCancel2: function () {
                this.addDialog.close();
            },

            // onAddRow: function () {
            //     // Get the model for the batch table
            //     var oModel = this.getView().getModel("jTabModel");

            //     // Get the existing data
            //     var aData = oModel.getProperty("/items");

            //     // Add an empty row
            //     aData.push({
            //         ID: "",
            //         NAME: "",
            //         DOJ: "",
            //         ROLE: "",
            //         COMPANYN: "",
            //         SKILLED: ""
            //     });

            //     // Update the model with the new data
            //     oModel.setProperty("/items", aData);
            // }


            // ----------addRow functionality inside batch fragmnet----------
            onAddRow: function () {
                var oTable = this.getView().byId("batchTable");
                this.oTableModel = sap.ui.getCore().byId("batchTable").getModel("jTabModel").getProperty("/items");
                var oNewRow = {
                    "ID": "",
                    "NAME": "",
                    "DOJ": "",
                    "ROLE": "",
                    "COMPANYN": "",
                    "SKILLED": ""
                };
                this.oTableModel.push(oNewRow);
                sap.ui.getCore().byId("batchTable").getModel("jTabModel").setProperty("/items", this.oTableModel);
            },


            // ----------------batch Delete functionality inside fragment---------------------
            onDeleteRow: function (oEvent) {
                var oTable = sap.ui.getCore().byId("batchTable");
                var oModel = oTable.getModel("jTabModel");
                var oItem = oEvent.getSource().getParent(); // Get the clicked item
                var oBindingContext = oItem.getBindingContext("jTabModel"); // Get the binding context of the clicked item

                if (oBindingContext) {
                    var iIndex = oBindingContext.getPath().split("/").pop(); // Get the index of the clicked item

                    // Ensure that the model and items property exist
                    var aItems = oModel.getProperty("/items");
                    if (aItems && aItems.length > iIndex) {
                        // Remove the row directly from the model based on the index
                        aItems.splice(iIndex, 1);
                        oModel.refresh();
                    }
                }
            },


            // -----------------Batch Save Functionality-------------------

            onBatchSave: function () {
                var oTable = sap.ui.getCore().byId("batchTable");
                var oModel = oTable.getModel("jTabModel");
                var odataModel = this.getOwnerComponent().getModel();
                var aItems = oModel.getProperty("/items");

                // Validate if there are any items in the model
                if (aItems && aItems.length > 0) {
                    // Perform your save logic for each row
                    for (var i = 0; i < aItems.length; i++) {
                        var oRowData = aItems[i];
                        odataModel.setUseBatch(true);
                        // Create an empty entry for the main view's model
                        odataModel.createEntry("/Interactions_Employee", {
                            properties: {
                                ID: oRowData.ID,
                                NAME: oRowData.NAME,
                                DOJ: oRowData.DOJ,
                                ROLE: oRowData.ROLE,
                                COMPANYN: oRowData.COMPANYN,
                                SKILLED: oRowData.SKILLED
                            }
                        });
                    }
                    // Submit the changes to persist the new entry to the backend
                    odataModel.submitChanges({
                        success: function () {
                            odataModel.setUseBatch(false);
                            // Optional: Show a success message or perform additional actions after saving
                            MessageBox.success("Record's Has Been created Successfully!");
                            that.getData();
                        },
                        error: function (oError) {
                            // Optional: Show an error message or handle errors
                            MessageBox.error("Error saving row: " + oError.message);
                        }
                    });


                    // Optionally, you can show a message or perform additional actions after saving all rows
                    // MessageBox.success("All rows saved successfully!");
                } else {
                    MessageBox.warning("No data to save.");
                }

                this.addDialog.close();
            },



            // Add a new function for multi-delete
            onTableMultiDeleteButtonPress: function () {
                var that = this;
                var oTable = this.getView().byId("table");
                // var oModel = oTable.getModel();
                var aSelectedItems = oTable.getSelectedItems();

                if (aSelectedItems.length > 0) {
                    var url = that.getOwnerComponent().getModel().sServiceUrl;
                    var oModel = new sap.ui.model.odata.ODataModel(url);
                    var aBatchOperations = [];

                    for (var i = 0; i < aSelectedItems.length; i++) {
                        var oSelectedItem = aSelectedItems[i];
                        var sObject = oSelectedItem.getBindingContext().getObject();
                        // var sId = oModel.getProperty(sObject + "ID"); // Assuming ID is the key field
                        var oEntry = oSelectedItem.getBindingContext().getObject();
                        // Add a delete operation to the batch
                        aBatchOperations.push(oModel.createBatchOperation("/Interactions_Employee(" + sObject.ID + ")", "DELETE", oEntry));
                    }

                    // Execute the batch operations
                    oModel.addBatchChangeOperations(aBatchOperations);
                    oModel.submitBatch(function (oData) {
                        // Handle success
                        MessageBox.success("Selected rows deleted successfully!");
                        that.getData();
                        oTable.removeSelections();

                    }, function (oError) {
                        // Handle error
                        MessageBox.error("Error deleting selected rows: " + oError.message);
                    });
                } else {
                    MessageBox.warning("No rows selected for deletion.");
                }
            },




            // -----update fragment open-----------
                onMultiEditBatchButton: function() {
                    var that = this;
                    that.array = [];
                    var oTable = that.byId("table");
                    var items = oTable.getSelectedItem();
                    if (items === null) {
                    sap.m.MessageBox.warning("Please Select Records");
                    } else {

                    if (!this.oDialog) {
                    this.oDialog = sap.ui.xmlfragment("com.odatacrudoperations.capodatacrudoperations.fragments.multiUpdateBatch", this);
                    this.getView().addDependent(this.oDialog);
                    }
                    sap.ui.getCore().byId("batchIdInputBox").setEnabled(false);
                    this.oDialog.open();
                    }
                    var selectedItem = that.getView().byId("table").getSelectedItems()
                    for (var i = 0; i <= selectedItem.length - 1; i++) {
                    var item = selectedItem[i];
                    that.array.push(item.getBindingContext().getObject());
                    }
                    var updateModel = new sap.ui.model.json.JSONModel(that.array);
                    that.getView().setModel(updateModel, "updateModel");
                    },
                    onCancel1: function() {
                    this.oDialog.close();
                    },
                

            // ------------batch multisave----------
            onSaveMulti: function() {

                var addedProdCodeModel = that.getView().getModel("updateModel").getData();
                var url = that.getOwnerComponent().getModel().sServiceUrl;
                var oDataModel = new sap.ui.model.odata.ODataModel(url, { json: true });

                // Set the Content-Type header to application/json
                oDataModel.setHeaders({ "Content-Type": "application/json" });
                oDataModel.setUseBatch(true);
                var batchChanges = [];
                for (var i = 0; i < addedProdCodeModel.length; i++) {
                var addRow = addedProdCodeModel[i];
                delete addRow.__metadata;
                var selectedRowId = addRow.ID;
                var uPath = "/Interactions_Employee(" + selectedRowId + ")";
                console.log("Batch Operation URL:", uPath);
                console.log("Batch Operation Payload:", addRow);
                // oDataModel.update("/Interactions_Employee("+ selectedRowId + ")", addRow);

                batchChanges.push(oDataModel.createBatchOperation(uPath, "PUT", addRow));
              
                }
                 // Log all batch operations before submitting
                console.log("Batch Changes:", batchChanges);
                oDataModel.addBatchChangeOperations(batchChanges);

                oDataModel.submitBatch(function(oData) {
                // Success callback function

                sap.m.MessageBox.success("Recorde Updated Successfully",oData);

                that.getData(); // Refresh the main table data
                that.getView().getModel().refresh();
                that.getView().getModel("updateModel").refresh();
                 // console.log(that.getView().getModel().getData()); // Log the data to the console
                // that.getView().getModel().refresh();
                // that.getView().getModel("updateModel").refresh();
                // Handle the response data
                },
                 function(oError) {
                // Error callback function
                sap.m.MessageBox.waning("failed",oError);
                // Handle the error
                });
                this.oDialog.close();
                }, 




          

            //      // Assume you have a function to open the batch update dialog
            // onMultiEditBatchButton: function () {
            //     if (!this.batchUpdateDialog) {
            //         this.batchUpdateDialog = sap.ui.xmlfragment("com.odatacrudoperations.capodatacrudoperations.fragments.multiUpdateBatch", this);
            //     }

            //     var oTable = this.getView().byId("table");
            //     var aSelectedItems = oTable.getSelectedItems();

            //     if (aSelectedItems.length > 0) {
            //         var oModel = new sap.ui.model.json.JSONModel();
            //         var aData = [];

            //         // Populate the model with selected items data
            //         for (var i = 0; i < aSelectedItems.length; i++) {
            //             var oSelectedItem = aSelectedItems[i];
            //             var oItemData = oSelectedItem.getBindingContext().getObject();
            //             aData.push(oItemData);
            //         }

            //         oModel.setData(aData);

            //         // Set the model to the batch update dialog
            //         sap.ui.getCore().byId("multiBatchUpdateFragment").setModel(oModel, "updateModel");

            //         this.batchUpdateDialog.open();
            //     } else {
            //         MessageBox.warning("No rows selected for batch update.");
            //     }
            // },

            // // Assume you have a function to handle the batch update save
            // onSaveMulti: function () {
            //     var oTable = this.getView().byId("table");
            //     // var oModel = oTable.getModel();
            //     var url = that.getOwnerComponent().getModel().sServiceUrl;
            //     var oModel = new sap.ui.model.odata.ODataModel(url);

            //     var oUpdateModel = sap.ui.getCore().byId("multiBatchUpdateFragment").getModel("updateModel");
            //     var aUpdatedData = oUpdateModel.getData();

            //     // Loop through the updated data and perform batch updates
            //     for (var i = 0; i < aUpdatedData.length; i++) {
            //         var oUpdatedItem = aUpdatedData[i];

            //         // Perform the update for each item, e.g., using oModel.update()
            //         oModel.update("/Interactions_Employee(" + oUpdatedItem.ID + ")", oUpdatedItem, {
            //             success: function () {
            //                 // Handle success
            //                 MessageBox.success("Batch updates saved successfully!");
            //             },
            //             error: function (oError) {
            //                 // Handle error
            //                 MessageBox.error("Error saving batch updates: " + oError.message);
            //             }
            //         });
            //     }

            //     // Optionally, you can close the batch update dialog
            //     this.batchUpdateDialog.close();
            // },








            // onMultiEditBatchButton: function () {


            //     // Assuming you have an ODataModel initialized
            //     //var oModel = new sap.ui.model.odata.v2.ODataModel("YourODataServiceURL");
            //     var url = that.getOwnerComponent().getModel().sServiceUrl;
            //     var oModel = new sap.ui.model.odata.ODataModel(url);

            //                 var oTable = that.byId("table");
            //                 var items = oTable.getSelectedItem();
            //                 if (items === null) {
            //                 sap.m.MessageBox.warning("Please Select Records");
            //                 } else {

            //                 if (!this.oDialog) {
            //                 this.oDialog = sap.ui.xmlfragment("com.odatacrudoperations.capodatacrudoperations.fragments.multiUpdateBatch", this);
            //                 this.getView().addDependent(this.oDialog);
            //                 }
            //                 sap.ui.getCore().byId("batchIdInputBox").setEnabled(false);
            //                 this.oDialog.open();
            //                 }
            //     // Create an array of batch operations
            //     var aBatchOperations = [];

            //     // Get the selected items from your UI, assuming you have a Table with ID 'table'
            //     var aSelectedItems = that.getView().byId("table").getSelectedItems();

            //     // Iterate over the selected items and construct the batch update operations
            //     aSelectedItems.forEach(function (oSelectedItem) {
            //         var oEntityToUpdate = {
            //             // Construct this object based on your UI controls, assuming you have Text or Input controls
            //             Property1: oSelectedItem.getCells()[1].getText(), // Assuming the property is in the second column
            //             Property2: oSelectedItem.getCells()[2].getText()  // Assuming the property is in the third column
            //             // ... Add other properties as needed
            //         };

            //         // Create a batch operation for the update
            //         var sEntityKey = oSelectedItem.getBindingContext().getPath().substr(1); // Extract the entity key from the binding context path
            //         var oUpdateOperation = oModel.createBatchOperation("/Interactions_Employee('" + sEntityKey + "')", "PUT", oEntityToUpdate);
            //         aBatchOperations.push(oUpdateOperation);
            //     });

            //     // Submit the batch request
            //     oModel.addBatchChangeOperations(aBatchOperations);
            //     oModel.submitBatch(function (oData) {
            //         // Batch request successful
            //         console.log("Batch request successful", oData);
            //         // Refresh your data after the batch update
            //         that.getData();
            //     }, function (oError) {
            //         // Batch request failed
            //         console.error("Batch request failed", oError);
            //     });
            // },





        });
    });



