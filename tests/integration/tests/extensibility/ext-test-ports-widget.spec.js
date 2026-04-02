/// <reference types="cypress" />
import 'cypress-file-upload';
import jsyaml from 'js-yaml';

context('Test Ports Widget', () => {
  Cypress.skipAfterFail();

  before(() => {
    cy.handleExceptions();
    cy.loginAndSelectCluster();
    cy.createNamespace('ports-widget');
  });

  it('Creates the Ports widget config and sample service', () => {
    cy.getLeftNav().contains('Cluster Overview').click();

    cy.contains('ui5-button', 'Upload YAML').click();

    cy.loadFiles('examples/ports-widget/configuration.yaml').then(
      (resources) => {
        const input = resources.map((r) => jsyaml.dump(r)).join('\n---\n');
        cy.pasteToMonaco(input);
      },
    );

    cy.get('ui5-dialog')
      .contains('ui5-button', 'Upload')
      .should('be.visible')
      .click();

    cy.get('ui5-dialog')
      .find('.status-message-success')
      .should('have.length', 1);

    cy.loadFiles('examples/ports-widget/samples.yaml').then((resources) => {
      const input = resources.map((r) => jsyaml.dump(r)).join('\n---\n');
      cy.pasteToMonaco(input);
    });

    cy.get('ui5-dialog')
      .contains('ui5-button', 'Upload')
      .should('be.visible')
      .click();

    cy.get('ui5-dialog')
      .find('.status-message-success')
      .should('have.length', 1);
  });

  it('Displays ports inline in the list view', () => {
    cy.loginAndSelectCluster();

    cy.getLeftNav().contains('Namespaces').click();

    cy.typeInSearch('ports-widget');

    cy.clickListLink('ports-widget');

    cy.getLeftNav().contains('Examples').click();

    cy.getLeftNav().contains('Ports Widget Services').click();

    // Ports column shows inline format: name: port/protocol → targetPort
    cy.contains('http: 80/TCP → 8080');
    cy.contains('https: 443/TCP → 8443');
  });

  it('Displays ports as a list in the detail view', () => {
    cy.clickGenericListLink('test-ports-service');

    cy.getMidColumn().contains('Ports').should('be.visible');

    // In detail view the Ports widget renders as a list (break separator)
    cy.getMidColumn().contains('http: 80/TCP → 8080');
    cy.getMidColumn().contains('https: 443/TCP → 8443');
  });

  it('Displays port without targetPort in list view', () => {
    cy.getLeftNav().contains('Ports Widget Services').click();

    cy.contains('grpc: 9090/TCP');
  });
});
