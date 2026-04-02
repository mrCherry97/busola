import { render } from '@testing-library/react';
import { Ports } from '../Ports';
import { ExtensibilityTestWrapper } from './helpers';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('components/Extensibility/helpers', () => ({
  useGetPlaceholder: () => ({ emptyLeafPlaceholder: '-' }),
}));

describe('Ports', () => {
  describe('formatPort', () => {
    it('renders service port with name, protocol and different targetPort', () => {
      const value = [
        { name: 'http', port: 80, protocol: 'TCP', targetPort: 8080 },
      ];
      const { getByRole } = render(
        <ExtensibilityTestWrapper>
          <Ports value={value} structure={{}} />
        </ExtensibilityTestWrapper>,
      );
      expect(getByRole('list')).toBeInTheDocument();
      expect(getByRole('list').textContent).toContain('http: 80/TCP → 8080');
    });

    it('renders service port without name', () => {
      const value = [{ port: 443, protocol: 'TCP', targetPort: 8443 }];
      const { getByRole } = render(
        <ExtensibilityTestWrapper>
          <Ports value={value} structure={{}} />
        </ExtensibilityTestWrapper>,
      );
      expect(getByRole('list').textContent).toContain('443/TCP → 8443');
    });

    it('renders service port when targetPort equals port (no arrow)', () => {
      const value = [
        { name: 'same', port: 80, protocol: 'TCP', targetPort: 80 },
      ];
      const { getByRole } = render(
        <ExtensibilityTestWrapper>
          <Ports value={value} structure={{}} />
        </ExtensibilityTestWrapper>,
      );
      expect(getByRole('list').textContent).toContain('same: 80/TCP');
      expect(getByRole('list').textContent).not.toContain('→');
    });

    it('renders service port without protocol', () => {
      const value = [{ port: 80, targetPort: 8080 }];
      const { getByRole } = render(
        <ExtensibilityTestWrapper>
          <Ports value={value} structure={{}} />
        </ExtensibilityTestWrapper>,
      );
      expect(getByRole('list').textContent).toContain('80 → 8080');
    });

    it('renders container port with name and protocol', () => {
      const value = [{ name: 'app', containerPort: 3000, protocol: 'TCP' }];
      const { getByRole } = render(
        <ExtensibilityTestWrapper>
          <Ports value={value} structure={{}} />
        </ExtensibilityTestWrapper>,
      );
      expect(getByRole('list').textContent).toContain('app:3000/TCP');
    });

    it('renders container port without name', () => {
      const value = [{ containerPort: 8080, protocol: 'UDP' }];
      const { getByRole } = render(
        <ExtensibilityTestWrapper>
          <Ports value={value} structure={{}} />
        </ExtensibilityTestWrapper>,
      );
      expect(getByRole('list').textContent).toContain('8080/UDP');
    });

    it('renders container port without protocol', () => {
      const value = [{ name: 'metrics', containerPort: 9090 }];
      const { getByRole } = render(
        <ExtensibilityTestWrapper>
          <Ports value={value} structure={{}} />
        </ExtensibilityTestWrapper>,
      );
      expect(getByRole('list').textContent).toContain('metrics:9090');
    });
  });

  describe('separator modes', () => {
    it('defaults to break separator (renders a list)', () => {
      const value = [
        { port: 80, targetPort: 8080 },
        { port: 443, targetPort: 8443 },
      ];
      const { getByRole, getAllByRole } = render(
        <ExtensibilityTestWrapper>
          <Ports value={value} structure={{}} />
        </ExtensibilityTestWrapper>,
      );
      expect(getByRole('list')).toBeInTheDocument();
      expect(getAllByRole('listitem')).toHaveLength(2);
    });

    it('renders inline with custom separator', () => {
      const value = [
        { port: 80, targetPort: 8080 },
        { port: 443, targetPort: 8443 },
      ];
      const { container } = render(
        <ExtensibilityTestWrapper>
          <Ports value={value} structure={{ separator: ', ' }} />
        </ExtensibilityTestWrapper>,
      );
      const spans = container.querySelectorAll('span > span');
      expect(spans).toHaveLength(2);
      expect(container.textContent).toContain(', ');
    });

    it('does not add separator after last inline item', () => {
      const value = [{ port: 80 }, { port: 443 }];
      const { container } = render(
        <ExtensibilityTestWrapper>
          <Ports value={value} structure={{ separator: ' | ' }} />
        </ExtensibilityTestWrapper>,
      );
      const text = container.textContent ?? '';
      const separatorCount = (text.match(/ \| /g) ?? []).length;
      expect(separatorCount).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('renders empty placeholder when value is null', () => {
      const { getByText } = render(
        <ExtensibilityTestWrapper>
          <Ports value={null} structure={{}} />
        </ExtensibilityTestWrapper>,
      );
      expect(getByText('-')).toBeInTheDocument();
    });

    it('renders empty placeholder when value is empty array', () => {
      const { getByText } = render(
        <ExtensibilityTestWrapper>
          <Ports value={[]} structure={{}} />
        </ExtensibilityTestWrapper>,
      );
      expect(getByText('-')).toBeInTheDocument();
    });

    it('renders error key when value is not an array', () => {
      const { getByText } = render(
        <ExtensibilityTestWrapper>
          <Ports value={'invalid'} structure={{}} />
        </ExtensibilityTestWrapper>,
      );
      expect(
        getByText('extensibility.widgets.ports.error'),
      ).toBeInTheDocument();
    });

    it('renders multiple ports in break mode', () => {
      const value = [
        { name: 'http', port: 80, protocol: 'TCP', targetPort: 8080 },
        { name: 'https', port: 443, protocol: 'TCP', targetPort: 8443 },
        { containerPort: 9090, protocol: 'TCP' },
      ];
      const { getAllByRole } = render(
        <ExtensibilityTestWrapper>
          <Ports value={value} structure={{ separator: 'break' }} />
        </ExtensibilityTestWrapper>,
      );
      expect(getAllByRole('listitem')).toHaveLength(3);
    });
  });

  describe('static properties', () => {
    it('has array=true', () => {
      expect(Ports.array).toBe(true);
    });

    it('has inline=true', () => {
      expect(Ports.inline).toBe(true);
    });

    it('has copyable=true', () => {
      expect(Ports.copyable).toBe(true);
    });

    it('copyFunction joins with newline for break separator', () => {
      const value = [
        { name: 'http', port: 80, targetPort: 8080 },
        { name: 'https', port: 443, targetPort: 8443 },
      ];
      const result = Ports.copyFunction({
        value,
        structure: { separator: 'break' },
      });
      expect(result).toBe('http: 80 → 8080\nhttps: 443 → 8443');
    });

    it('copyFunction joins with separator for inline mode', () => {
      const value = [{ port: 80 }, { port: 443 }];
      const result = Ports.copyFunction({
        value,
        structure: { separator: ', ' },
      });
      expect(result).toBe('80, 443');
    });

    it('copyFunction defaults to ", " when no separator', () => {
      const value = [{ port: 80 }, { port: 443 }];
      const result = Ports.copyFunction({ value, structure: {} });
      expect(result).toBe('80, 443');
    });

    it('copyFunction returns empty string for non-array value', () => {
      const result = Ports.copyFunction({ value: 'invalid', structure: {} });
      expect(result).toBe('');
    });
  });
});
