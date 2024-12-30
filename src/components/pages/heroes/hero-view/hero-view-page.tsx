import { Button, Divider, Popover } from 'antd';
import { DownOutlined, EditOutlined } from '@ant-design/icons';
import { AppHeader } from '../../../panels/app-header/app-header';
import { DangerButton } from '../../../controls/danger-button/danger-button';
import { DropdownButton } from '../../../controls/dropdown-button/dropdown-button';
import { HeroPanel } from '../../../panels/elements/hero-panel/hero-panel';
import { Options } from '../../../../models/options';
import { PanelMode } from '../../../../enums/panel-mode';
import { Toggle } from '../../../controls/toggle/toggle';
import { useModals } from '../../../../hooks/use-modals';
import { useNavigation } from '../../../../hooks/use-navigation';
import { useParams } from 'react-router';
import { usePersistedHero } from '../../../../hooks/use-persisted-hero';
import { usePersistedHeroes } from '../../../../hooks/use-persisted-heroes';
import { usePersistedOptions } from '../../../../hooks/use-persisted-options';

import './hero-view-page.scss';

interface Props {
	goHome: () => void;
	closeHero: () => void;
	editHero: (heroId: string) => void;
}

export const HeroPage = (props: Props) => {
	const modals = useModals();
	const navigation = useNavigation();
	const { heroId } = useParams<{ heroId: string }>();
	const { exportHero, deleteHero } = usePersistedHeroes();
	const { options, persistOptions } = usePersistedOptions();
	const hero = usePersistedHero(heroId!);
	try {
		const setShowSkillsInGroups = async (value: boolean) => {
			const copy = JSON.parse(JSON.stringify(options)) as Options;
			copy.showSkillsInGroups = value;
			await persistOptions(copy);
		};

		const setShowFreeStrikes = async (value: boolean) => {
			const copy = JSON.parse(JSON.stringify(options)) as Options;
			copy.showFreeStrikes = value;
			await persistOptions(copy);
		};

		const setShowStandardAbilities = async (value: boolean) => {
			const copy = JSON.parse(JSON.stringify(options)) as Options;
			copy.showStandardAbilities = value;
			await persistOptions(copy);
		};

		const setDimUnavailableAbilities = async (value: boolean) => {
			const copy = JSON.parse(JSON.stringify(options)) as Options;
			copy.dimUnavailableAbilities = value;
			await persistOptions(copy);
		};

		return (
			<div className='hero-view-page'>
				<AppHeader subtitle='Heroes' goHome={props.goHome}>
					<Button onClick={props.closeHero}>
						Close
					</Button>
					<Button onClick={() => modals.showHeroState(heroId!, 'hero')}>
						State
					</Button>
					<Button onClick={() => modals.showHeroRules(heroId!)}>
						Rules
					</Button>
					<Popover
						trigger='click'
						placement='bottom'
						content={(
							<div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
								<Toggle label='Show skills in groups' value={options.showSkillsInGroups} onChange={setShowSkillsInGroups} />
								<Toggle label='Show free strikes' value={options.showFreeStrikes} onChange={setShowFreeStrikes} />
								<Toggle label='Show standard abilities' value={options.showStandardAbilities} onChange={setShowStandardAbilities} />
								<Toggle label='Dim unavailable abilities' value={options.dimUnavailableAbilities} onChange={setDimUnavailableAbilities} />
								<Divider />
								<DropdownButton
									label='Export'
									items={[
										{
											key: 'image',
											label: <div className='ds-text centered-text'>Export As Image</div>
										},
										{
											key: 'pdf',
											label: <div className='ds-text centered-text'>Export As PDF</div>
										},
										{
											key: 'json',
											label: <div className='ds-text centered-text'>Export As Data</div>
										}
									]}
									onClick={key => exportHero(heroId!, key as 'image' | 'pdf' | 'json')}
								/>
								<Button icon={<EditOutlined />} onClick={() => (props).editHero(heroId!)}>Edit</Button>
								<DangerButton onConfirm={async () => { await deleteHero(heroId!); navigation.goToHeroList(); }} />
							</div>
						)}
					>
						<Button>
							Options
							<DownOutlined />
						</Button>
					</Popover>
				</AppHeader>
				<div className='hero-view-page-content'>
					{
						hero
							? <HeroPanel
								hero={hero}
								mode={PanelMode.Full}
							/>
							: null
					}
				</div>
			</div>
		);
	} catch (ex) {
		console.error(ex);
		return null;
	}
};
