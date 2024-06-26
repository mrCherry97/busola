import PropTypes from 'prop-types';
import { Tooltip } from 'shared/components/Tooltip/Tooltip';
import classNames from 'classnames';
import { RadialChart } from '@ui5/webcomponents-react-charts';
import { spacing } from '@ui5/webcomponents-react-base';
import './UI5RadialChart.scss';
import { Text } from '@ui5/webcomponents-react';

const TooltipWrapper = ({ tooltipProps, children }) => {
  if (tooltipProps?.content) {
    return <Tooltip {...tooltipProps}>{children}</Tooltip>;
  }
  return children;
};

export const UI5RadialChart = ({
  size = 200,
  value,
  max,
  color = 'var(--sapBrandColor)',
  onClick,
  tooltip,
  additionalInfo = '',
}) => {
  const percent = max && value ? Math.round((value * 100) / max) : 0;
  const text = percent + '%';
  const textSize = size / Math.max(3.5, text.length) + 'px';

  const classnames = classNames(`radial-chart`, {
    'cursor-pointer': onClick,
  });

  return (
    <TooltipWrapper tooltipProps={tooltip}>
      <div className={classnames} onClick={onClick}>
        <RadialChart
          displayValue={text}
          displayValueStyle={{
            fontSize: textSize,
            fill: color,
          }}
          value={value}
          maxValue={max}
          color={color}
          style={{
            height: size + 'px',
            width: size + 'px',
            ...spacing.sapUiTinyMarginTopBottom,
          }}
          chartConfig={{
            innerRadius: '99%',
            outerRadius: '99%',
            barSize: 12,
          }}
        />
        {additionalInfo && (
          <Text className="additional-info">{additionalInfo}</Text>
        )}
      </div>
    </TooltipWrapper>
  );
};

UI5RadialChart.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  value: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  title: PropTypes.string,
};
