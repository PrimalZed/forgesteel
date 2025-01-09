import { Domain } from '../../../../models/domain';
import { FeaturePanel } from '../feature-panel/feature-panel';
import { HeaderText } from '../../../controls/header-text/header-text';
import { Hero } from '../../../../models/hero';
import { Markdown } from '../../../controls/markdown/markdown';
import { PanelMode } from '../../../../enums/panel-mode';
import { Space } from 'antd';

import './domain-panel.scss';

interface Props {
	domain: Domain;
	hero?: Hero;
	mode?: PanelMode;
}

export const DomainPanel = (props: Props) => {
	try {
		return (
			<div className='domain-panel' id={props.mode === PanelMode.Full ? props.domain.id : undefined}>
				<HeaderText level={1}>{props.domain.name || 'Unnamed Domain'}</HeaderText>
				<Markdown text={props.domain.description} />
				{
					props.mode === PanelMode.Full ?
						props.domain.featuresByLevel.filter(lvl => lvl.features.length > 0).map(lvl => (
							<Space key={lvl.level} direction='vertical'>
								<HeaderText level={1}>Level {lvl.level.toString()}</HeaderText>
								{...lvl.features.map(f => <FeaturePanel key={f.id} feature={f} hero={props.hero} mode={PanelMode.Full} />)}
							</Space>
						))
						: null
				}
			</div>
		);
	} catch (ex) {
		console.error(ex);
		return null;
	}
};
