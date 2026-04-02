/* global cy, describe, it */
import { Ports } from '../Ports';

describe('Ports Component', () => {
  it('renders service ports as a list (break separator)', () => {
    const value = [
      { name: 'http', port: 80, protocol: 'TCP', targetPort: 8080 },
      { name: 'https', port: 443, protocol: 'TCP', targetPort: 8443 },
    ];

    cy.mount(<Ports value={value} structure={{}} />);

    cy.get('ul').should('exist');
    cy.get('li').should('have.length', 2);
    cy.get('li').first().should('contain.text', 'http: 80/TCP → 8080');
    cy.get('li').last().should('contain.text', 'https: 443/TCP → 8443');
  });

  it('renders container ports as a list', () => {
    const value = [
      { name: 'app', containerPort: 3000, protocol: 'TCP' },
      { containerPort: 9090 },
    ];

    cy.mount(<Ports value={value} structure={{}} />);

    cy.get('li').should('have.length', 2);
    cy.get('li').first().should('contain.text', 'app:3000/TCP');
    cy.get('li').last().should('contain.text', '9090');
  });

  it('renders inline ports with separator', () => {
    const value = [
      { port: 80, targetPort: 8080 },
      { port: 443, targetPort: 8443 },
    ];

    cy.mount(<Ports value={value} structure={{ separator: ', ' }} />);

    cy.get('ul').should('not.exist');
    cy.get('span').should('contain.text', ', ');
  });

  it('renders empty placeholder for null value', () => {
    cy.mount(<Ports value={null} structure={{}} />);

    cy.get('ul').should('not.exist');
    cy.contains('-').should('be.visible');
  });

  it('renders empty placeholder for empty array', () => {
    cy.mount(<Ports value={[]} structure={{}} />);

    cy.contains('-').should('be.visible');
  });

  it('renders error for non-array value', () => {
    cy.mount(<Ports value={'invalid' as any} structure={{}} />);

    cy.contains('extensibility.widgets.ports.error').should('be.visible');
  });

  it('renders service port without targetPort (no arrow)', () => {
    const value = [{ port: 80, protocol: 'TCP' }];

    cy.mount(<Ports value={value} structure={{}} />);

    cy.get('li').should('contain.text', '80/TCP');
    cy.get('li').should('not.contain.text', '→');
  });

  it('does not render separator after the last inline item', () => {
    const value = [{ name: 'http', port: 80, targetPort: 8080 }];

    cy.mount(<Ports value={value} structure={{ separator: ', ' }} />);

    cy.contains(', ').should('not.exist');
  });
});
