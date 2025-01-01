import { useParams } from 'react-router';
import { usePersistedHero } from '@/hooks/use-persisted-hero';
import { AppHeader } from '@/components/panels/app-header/app-header';
import { useNavigation } from '@/hooks/use-navigation';
import { Input } from 'antd';
import { useMemo } from 'react';

import './hero-sheet.scss';
import { FieldH2 } from '@/components/controls/field-h2/field-h2';
import { FieldUnderline } from '@/components/controls/field-underline/field-underline';
import { FieldCharacteristic } from '@/components/controls/field-characteristic/field-characteristic';
import { FieldCombat } from '@/components/controls/field-combat/field-combat';

export const HeroSheetPage = () => {
	const navigation = useNavigation();
	const { heroId } = useParams<{ heroId: string }>();
	const hero = usePersistedHero(heroId!);

	const subclass = useMemo(() => hero?.class?.subclasses.find(sc => sc.selected), [ hero ]);

	if (!hero) {
		return null;
	}

	return (
		<div className='hero-sheet-page'>
			<AppHeader subtitle='Heroes' goHome={navigation.goToWelcome} />
			<div className='hero-sheet-page-content'>
				<div className='hero-sheet-grid'>
					<div className='hero-header-card'>
						<div className='hero-name-card'>
							<FieldUnderline className='hero-name' value={hero.name} label='Character Name' />
							<FieldUnderline className='hero-ancestry' value={hero.ancestry?.name} label='Ancestry' />
							<FieldUnderline className='hero-class' value={hero.class?.name} label='Class' />
							<FieldUnderline className='hero-career' value={hero.career?.name} label='Career' />
							<FieldUnderline className='hero-subclass' value={subclass?.name} label='Subclass' />
						</div>
						<div className='hero-campaign-card'>
							<div className='hero-campaign-row-1'>
								<div className='hero-victories'>
									<label>Victories:</label>
									<span>{hero.state.victories}</span>
									</div>
								<div className='hero-level'>
									<label>Level</label>
									<span>{hero.class?.level}</span>
								</div>
							</div>
							<div className='hero-campaign-row-2'>
								<div className="civ">
									<FieldH2 className='hero-wealth' value={hero.state.wealth} label='Wealth' />
									<FieldH2 className='hero-renown' value={hero.state.renown} label='Renown' />
								</div>
								<FieldH2 className='hero-xp' value={hero.state.xp} label='XP/Epic' />
							</div>
						</div>
					</div>
					<div className='hero-counters-card'>
						<div className='hero-counters-1'>
							<div className='hero-characteristics'>
								{
									hero.class?.characteristics.map(c => (
										<FieldCharacteristic key={c.characteristic} value={c.value} label={c.characteristic} />
									))
								}
							</div>
							<div className='hero-movement'>
								<div>
									<span>1M</span>
									<label>Size</label>
								</div>
								<div>
									<span>5</span>
									<label>Speed</label>
								</div>
								<div>
									<span>0</span>
									<label>Stability</label>
								</div>
							</div>
						</div>
						<div className='spacer' />
						<div className='hero-stamina'>
							<h4>Stamina</h4>
						</div>
						<div className='spacer' />
						<div className='hero-recoveries'>
							<FieldCombat value={hero.state.recoveriesUsed} label='Recoveries' />
						</div>
						<div className='spacer' />
						<div className='hero-resources'>
							<FieldCombat value={hero.state.heroicResource} label='Heroic Resources' />
						</div>
						<div className='spacer' />
						<div className='hero-surges'>
							<FieldCombat value={hero.state.surges} label='Surges' />
							<div style={{ fontSize: 'small', textAlign: 'center' }}>1 Surge = Damage {Math.max(...hero.class?.characteristics.map(c => c.value) ?? [])}</div>
							<div style={{ fontSize: 'small', textAlign: 'center' }}>2 Surges = Potency + 1</div>
						</div>
					</div>
					<div className='hero-row'>
						<div className='hero-modifiers-card'>
							<h4>Modifiers</h4>
						</div>
						<div className='hero-class-features-card'>
							<h4>Class Features</h4>
						</div>
					</div>
					<div className='hero-row'>
						<div className='hero-turn-card'>
							<h4>Your Turn</h4>
						</div>
						<div className='hero-conditions-card'>
							<h4>Conditions</h4>
						</div>
						<div className='hero-ancestry-traits-card'>
							<h4>Ancestry Traits</h4>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
