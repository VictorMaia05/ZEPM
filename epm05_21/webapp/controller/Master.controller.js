sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator"
    ], function (Controller, Filter, FilterOperator) {
        "use strict";
        return Controller.extend("tra0521.epm0521.controller.Main", {    
            onInit: function(){
            },
            aoPressionarItem: function(oEvent){

                // Resgatar a coluna clicada \\
                let oColumnListItem = oEvent.getSource();

                // Resgata o binding da coluna clicada. O Modelo não tem nome, então o getBindingContext fica sem parâmetro \\
                let oItem = oColumnListItem.getBindingContext().getObject();

                // Resgata o ID do parceiro \\
                let iPartnerId = oItem.PartnerId;

                // Resgata o Roteador \\
                let oRouter = this.getOwnerComponent().getRouter();

                // Navega p/ rota de detalhe \\
                oRouter.navTo("RotaDetalhe", {
                    PartnerId: iPartnerId
                });
            },

            aoAdicionar: function (oEvent) {

                // Pega router \\
                let oRouter = this.getOwnerComponent().getRouter();

                // Navega para 'RotaAdicionar' \\
                oRouter.navTo("RotaAdicionar");
            },

            aoPesquisar: function(oEvent){
                
                // Acessa a string de busca da ajuda de pesquisa \\
                let sPesquisa = oEvent.getParameter("newValue");

                // Acessa a view, depois a tabela, depois o contexto de vínculo da agregação 'items' \\ 
                let oBinding = this.getView().byId("parceiros").getBinding("items");

                let oFilter = new Filter({
                    path: "PartnerName1",
                    operator: FilterOperator.Contains,
                    value1: sPesquisa
                });

                // Monta lista de filtros \\
                let aFilters = [ oFilter ];

                // Executa o filtro \\
                oBinding.filter(aFilters);

            }

            });
        });