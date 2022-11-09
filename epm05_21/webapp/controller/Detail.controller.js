sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageBox",
        "sap/m/MessageToast"
    ], function (Controller, JSONModel, MessageBox, MessageToast) {
        "use strict";
        return Controller.extend("tra0521.epm0521.controller.Main", {    
            onInit: function() {

                this.inicializarModelosLocais();

                // Resgata o Roteador \\
                let oRouter = this.getOwnerComponent().getRouter();

                // Resgata o Modelo \\
                let oModel = this.getOwnerComponent().getModel();

                // Resgata a View \\
                let oView = this.getView();

                let oController = this;

                // Acessa a rota de detalhe, anexa o event patternMatched e declara função de callback para quando o evento for chamado \\
                oRouter.getRoute("RotaDetalhe").attachPatternMatched(function(oEvent){

                    // Habilitar o modo de edição dos 'inputs' \\
                    this.setarPropriedadeModelo("editavel", "/editavel", false);

                    // Habilitar o modo de edição \\
                    this.setarPropriedadeModelo("botoes", "/editar", false);

                    // Desabilitar o modo de visualização \\
                    this.setarPropriedadeModelo("botoes", "/visualizar", true);

                    // Acessa o nome da rota \\
                    let sRota = oEvent.getParameter("name");

                    if(sRota === "RotaDetalhe"){
                        oController.setarControlesEditaveis(false);
                    }

                    // Acessa os argumentos do Evento \\
                    let oArgumentos = oEvent.getParameter("arguments");

                    // Acessa o PartnerId \\
                    let iPartnerId = oArgumentos.PartnerId;

                    // Gera o caminho do modelo \\
                    let sCaminho = oModel.createKey("/BusinessPartners", {
                        PartnerId: iPartnerId
                    });
                    oView.bindElement(sCaminho);
                }.bind(this));

                oRouter.getRoute("RotaAdicionar").attachPatternMatched(function(oEvent){

                    // Habilitar o modo de edição dos 'inputs' \\
                    this.setarPropriedadeModelo("editavel", "/editavel", true);

                    // Habilitar o modo de edição \\
                    this.setarPropriedadeModelo("botoes", "/editar", true);

                    // Desabilitar o modo de visualização \\
                    this.setarPropriedadeModelo("botoes", "/visualizar", false);

                    // Cria uma entrada vazia \\
                    var oContext = oModel.createEntry("/BusinessPartners", {
                        properties: {
                            PartnerId: "",
                            PartnerType: "",
                            PartnerName1: "",
                            PartnerName2: "",
                            SearchTerm1: "",
                            SearchTerm2: "",
                            Street: "",
                            HouseNumber: "",
                            District: "",
                            City: "",
                            Region: "",
                            ZipCode: "",
                            Country: ""
                        }
                    });
                    oView.bindElement(oContext.getPath());
                }.bind(this));
            },
            setarControlesEditaveis: function(bValor){
               
                var sPath ;

                // Cria novo modelo JSON \\
                let oModel = new JSONModel();

                // Se verdadeiro \\
                if(bValor){
                    // Carrega modelo a partir do arquivo 'controlesAbertos' \\
                    oModel.loadData('/model/controlesAbertos.json');
                }
                // Se falso \\
                else{
                    // Carrega modelo a partir do arquivo 'controlesFechados' \\
                    oModel.loadData('/model/controlesFechados.json');
                   
                }

                // Mudando para o modelo 'editavel' \\
                this.getView().setModel(oModel, "editavel");
            },
            aoEditar: function(oEvent){

                // Habilita o modo de edição dos 'inputs' \\
                this.setarPropriedadeModelo("editavel", "/editavel", true);
               
                // Habilita o modo de edição \\
                this.setarPropriedadeModelo("botoes", "/editar", true);

                // Desabilita o modo de visualização \\
                this.setarPropriedadeModelo("botoes", "/visualizar", false);

                // Grava o caminho do contexto do parceiro \\
                this.sCaminhoContexto = this.getView().getBindingContext().getPath();

            },
            aoCancelar: function(oEvent){

                // Chama popup de confirmação se deseja de fato cancelar \\
                MessageBox.show("Deseja cancelar a edição?", {
                    title: "Cancelamento de edição",
                    actions: [ MessageBox.Action.YES, MessageBox.Action.NO ],
                    onClose: function (oAction) {

                        if(oAction===MessageBox.Action.YES) {

                            // Desabilita o modo de edição dos 'inputs' \\
                            this.setarPropriedadeModelo("editavel", "/editavel", false);
               
                            // Desabilita o modo de edição \\
                            this.setarPropriedadeModelo("botoes", "/editar", false);

                            // Habilita o modo de visualização \\
                            this.setarPropriedadeModelo("botoes", "/visualizar", true);

                            // Resgata modelo \\
                            let oModel = this.getView().getModel();

                            // Cria uma lista com um elemento - o caminho do contexto \\
                            let aCaminhos = [
                                this.sCaminhoContexto
                            ];

                            // Reseta as alterações \\
                            oModel.resetChanges(aCaminhos);
                        }

                    }.bind(this) // Salva o contexto do this apontando para o controller, o que ocorre fora da função \\
                });

            },

            inicializarModelosLocais: function() {

                // Pega View \\
                let oView = this.getView();

                // Cria nova instância de modelo JSON \\
                let oModeloBotao = new JSONModel();
                
                // Cria propriedade 'visualizar' que controla o modo de visualização \\
                oModeloBotao.setProperty("/visualizar", true);

                 // Cria propriedade 'editar' que controla o modo de edição \\
                 oModeloBotao.setProperty("/editar", false);

                // Cria e define o nome do modelo para 'botoes' \\
                oView.setModel(oModeloBotao, "botoes");

                // Cria nova instância de modelo JSON \\
                let oModeloEditavel = new JSONModel();

                // Cria propriedade 'editavel' \\
                oModeloEditavel.setProperty("/editavel", true);

                // Cria e define o nome do modelo para 'editavel' \\
                oView.setModel(oModeloEditavel, "editavel");

            },

            aoSalvar: function() {

                // Resgata o router \\
                let oRouter = this.getOwnerComponent().getRouter();

                // Resgata o modelo \\
                let oModel = this.getView().getModel();
                
                // Resgata o Form \\
                let oForm = this.getView().byId("FormParceiro");

                // Coloca o programa para em 'carregando...' \\
                oForm.setBusy(true);

                let oDados = this.getView().getBindingContext().getObject();

                if(oDados.PartnerId) {

                    oModel.update(this.sCaminhoContexto, oDados, {
                        success: function (oData) {
                            MessageToast.show("Atualização do parceiro " + oDados.PartnerId + " feita com sucesso!");
    
                            // Destrava o programa \\
                            oForm.setBusy(false);
    
                            // Altera o valor da propriedade 'editavel' \\
                            this.setarPropriedadeModelo("editavel", "/editavel", false);
    
                            // Habilitar o modo de edição \\
                            this.setarPropriedadeModelo("botoes", "/editar", false);
    
                            // Desabilitar o modo de visualização \\
                            this.setarPropriedadeModelo("botoes", "/visualizar", true);
    
                        }.bind(this), // Salva o contexto do this apontando para o controller, o que ocorre fora da função \\
                        error: function (oError) {
                            MessageBox.error("Erro ao atualizar parceiro " + oError.PartnerId);
    
                            // Destrava o programa' \\
                            oForm.setBusy(false);
                        }.bind(this) // Salva o contexto do this apontando para o controller, o que ocorre fora da função \\
                    });

                }
                else {

                    oModel.create("/BusinessPartners", oDados, {
                        success: function(oData){
                            MessageToast.show("Parceiro " + oData.PartnerId + " criado!", {
                                
                                // Aumenta o tempo de duração da mensagem na tela \\
                                animationDuration: 10000
                            });

                            // Destrava o programa \\
                            oForm.setBusy(false);

                            // Navega de volta para a rota 'RouteMaster' sem deixar histórico - comando 'true' \\
                            oRouter.navTo("RouteMaster", true);
                        },
                        error: function(oError){
                            MessageBox.error("Erro ao criar parceiro");

                            // Destrava o programa \\
                            oForm.setBusy(false);    
                        }
                    });
                }

                
            },

            aoDigitarCEP: function(oEvent){
                //acessa o valor do Input
                let sValor = oEvent.getParameter("value");
                //resgata o Input
                var oInput = oEvent.getSource();
                if(sValor.length !== 9){
                    oInput.setValueState(sap.ui.core.ValueState.Error);
                }else{
                    oInput.setValueState(sap.ui.core.ValueState.None);
                }
            },

            setarPropriedadeModelo(sModelo, sPropriedade, bValor) {

                // Pega modelo 'botoes' \\
                let oModel = this.getView().getModel(sModelo);

                // Verifica se modelo foi encontrado \\
                if(oModel) {
                    oModel.setProperty(sPropriedade, bValor);
                }
            }

        });
    });