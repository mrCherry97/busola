import { useTranslation } from 'react-i18next';
import { ClusterStorageType } from '../ClusterStorageType';
import { useGetGardenerProvider } from './useGetGardenerProvider';
import { useGetVersions } from './useGetVersions';
import { useFeature } from 'hooks/useFeature';
import { DynamicPageComponent } from 'shared/components/DynamicPageComponent/DynamicPageComponent';
import ResourceDetailsCard from 'shared/components/ResourceDetails/ResourceDetailsCard';
import { Text } from '@ui5/webcomponents-react';
import ClusterModulesCard from './ClusterModulesCard';

const GardenerProvider = () => {
  const { t } = useTranslation();
  const showGardenerMetadata = useFeature('SHOW_GARDENER_METADATA')?.isEnabled;

  const provider = useGetGardenerProvider({
    skip: !showGardenerMetadata,
  });

  if (!showGardenerMetadata) return null;
  if (!provider) return null;

  return (
    <DynamicPageComponent.Column title={t('gardener.headers.provider')}>
      <p className="gardener-provider">{provider}</p>
    </DynamicPageComponent.Column>
  );
};

export default function ClusterDetails({ currentCluster }) {
  const { t } = useTranslation();
  const { loading, kymaVersion, k8sVersion } = useGetVersions();
  const config = currentCluster?.config;

  return (
    <div className="resource-details-container">
      <ResourceDetailsCard
        titleText={t('cluster-overview.headers.metadata')}
        wrapperClassname="cluster-overview__details-wrapper"
        content={
          <>
            {!loading && k8sVersion && (
              <DynamicPageComponent.Column
                title={t('clusters.overview.kubernetes-version')}
              >
                {k8sVersion}
              </DynamicPageComponent.Column>
            )}
            {!loading && kymaVersion && (
              <DynamicPageComponent.Column
                title={t('clusters.overview.kyma-version')}
              >
                {kymaVersion}
              </DynamicPageComponent.Column>
            )}
            <DynamicPageComponent.Column title={t('clusters.storage.title')}>
              <ClusterStorageType clusterConfig={config} />
            </DynamicPageComponent.Column>
            <DynamicPageComponent.Column
              title={t('clusters.common.api-server-address')}
            >
              <Text>
                {currentCluster?.currentContext?.cluster?.cluster?.server}
              </Text>
            </DynamicPageComponent.Column>
            <GardenerProvider />
          </>
        }
      />
      <ClusterModulesCard />
    </div>
  );
}
