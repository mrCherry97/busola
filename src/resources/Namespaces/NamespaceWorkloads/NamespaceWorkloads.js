import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { useGetList } from 'shared/hooks/BackendAPI/useGet';

import {
  getHealthyReplicasCount,
  getStatusesPodCount,
  PodStatusCounterKey,
} from './NamespaceWorkloadsHelpers';
import { CountingCard } from 'shared/components/CountingCard/CountingCard';

NamespaceWorkloads.propTypes = { namespace: PropTypes.string };

export function NamespaceWorkloads({ namespace }) {
  const { t } = useTranslation();

  const { data: podsData } = useGetList()(
    namespace ? `/api/v1/namespaces/${namespace}/pods` : `/api/v1/pods`,
    {
      pollingInterval: 3200,
    },
  );

  const { data: deploymentsData } = useGetList()(
    namespace
      ? `/apis/apps/v1/namespaces/${namespace}/deployments`
      : `/apis/apps/v1/deployments`,
    {
      pollingInterval: 3200,
    },
  );

  const statusPodsData = getStatusesPodCount(podsData);
  const healthyPods = statusPodsData.has(PodStatusCounterKey.Healthy)
    ? statusPodsData.get(PodStatusCounterKey.Healthy)
    : 0;
  const pendingPods = statusPodsData.has(PodStatusCounterKey.Pending)
    ? statusPodsData.get(PodStatusCounterKey.Pending)
    : 0;
  const failedPods = statusPodsData.has(PodStatusCounterKey.Failed)
    ? statusPodsData.get(PodStatusCounterKey.Failed)
    : 0;

  const healthyDeployments = getHealthyReplicasCount(deploymentsData);

  return (
    <>
      {(podsData || deploymentsData) && (
        <>
          {podsData && (
            <div className="item-wrapper wide">
              <CountingCard
                className="item"
                value={podsData?.length}
                title={t('cluster-overview.statistics.pods-overview')}
                subTitle={t('cluster-overview.statistics.total-pods')}
                resourceUrl="pods"
                allNamespaceURL={false}
                extraInfo={[
                  {
                    title: t('cluster-overview.statistics.healthy-pods'),
                    value: healthyPods,
                  },
                  {
                    title: t('cluster-overview.statistics.pending-pods'),
                    value: pendingPods,
                  },
                  {
                    title: t('cluster-overview.statistics.failing-pods'),
                    value: failedPods,
                  },
                ]}
              />
            </div>
          )}
          {deploymentsData && (
            <div className="item-wrapper wide">
              <CountingCard
                className="item"
                value={deploymentsData?.length}
                title={t('cluster-overview.statistics.deployments-overview')}
                subTitle={t('cluster-overview.statistics.total-deployments')}
                resourceUrl="deployments"
                allNamespaceURL={false}
                extraInfo={[
                  {
                    title: t('cluster-overview.statistics.healthy-deployments'),
                    value: healthyDeployments,
                  },
                  {
                    title: t('cluster-overview.statistics.failing-deployments'),
                    value: deploymentsData.length - healthyDeployments,
                  },
                ]}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}
