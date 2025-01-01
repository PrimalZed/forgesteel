import { AimOutlined, BookOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Drawer } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { ReactNode, useCallback, useMemo } from 'react';
import { AbilityModal } from '../modals/ability/ability-modal';
import { AboutModal } from '../modals/about/about-modal';
import type { Ancestry } from '../../models/ancestry';
import { AncestryModal } from '../modals/ancestry/ancestry-modal';
import type { Career } from '../../models/career';
import { CareerModal } from '../modals/career/career-modal';
import type { Characteristic } from '../../enums/characteristic';
import { CharacteristicModal } from '../modals/characteristic/characteristic-modal';
import { ClassModal } from '../modals/class/class-modal';
import type { Complication } from '../../models/complication';
import { ComplicationModal } from '../modals/complication/complication-modal';
import type { Culture } from '../../models/culture';
import { CultureModal } from '../modals/culture/culture-modal';
import type { Domain } from '../../models/domain';
import { DomainModal } from '../modals/domain/domain-modal';
import type { Element } from '../../models/element';
import { EncounterModal } from '../modals/encounter/encounter-modal';
import type { Hero } from '../../models/hero';
import type { HeroClass } from '../../models/class';
import { HeroLogic } from '../../logic/hero-logic';
import { HeroStateModal } from '../modals/hero-state/hero-state-modal';
import type { Item } from '../../models/item';
import { ItemModal } from '../modals/item/item-modal';
import type { Kit } from '../../models/kit';
import { KitModal } from '../modals/kit/kit-modal';
import type { MonsterGroup } from '../../models/monster';
import { MonsterGroupModal } from '../modals/monster-group/monster-group-modal';
import { MonsterModal } from '../modals/monster/monster-modal';
import type { Perk } from '../../models/perk';
import { PerkModal } from '../modals/perk/perk-modal';
import { RulesModal } from '../modals/rules/rules-modal';
import type { Sourcebook } from '../../models/sourcebook';
import type { SourcebookElementKind } from '../../models/sourcebook-element-kind';
import { SourcebookLogic } from '../../logic/sourcebook-logic';
import { SourcebooksModal } from '../modals/sourcebooks/sourcebooks-modal';
import type { Title } from '../../models/title';
import { TitleModal } from '../modals/title/title-modal';
import { Utils } from '../../utils/utils';
import pbds from '../../assets/powered-by-draw-steel.png';
import { useNavigation } from '../../hooks/use-navigation';
import { usePersistedHeroes } from '../../hooks/use-persisted-heroes';
import { usePersistedPlaybook } from '../../hooks/use-persisted-playbook';
import { usePersistedSourcebooks } from '../../hooks/use-persisted-sourcebooks';

interface Props {
	onAncestryCreate: (ancestry: Ancestry, sourcebook: Sourcebook | null) => void;
	onCareerCreate: (culture: Career, sourcebook: Sourcebook | null) => void;
	onClassCreate: (heroClass: HeroClass, sourcebook: Sourcebook | null) => void;
	onComplicationCreate: (complication: Complication, sourcebook: Sourcebook | null) => void;
	onCultureCreate: (culture: Culture, sourcebook: Sourcebook | null) => void;
	onDomainCreate: (domain: Domain, sourcebook: Sourcebook | null) => void;
	onItemCreate: (item: Item, sourcebook: Sourcebook | null) => void;
	onKitCreate: (kit: Kit, sourcebook: Sourcebook | null) => void;
	onPerkCreate: (perk: Perk, sourcebook: Sourcebook | null) => void;
	onTitleCreate: (title: Title, sourcebook: Sourcebook | null) => void;
	onEncounterDelete: (encounterId: string) => Promise<void> | void;
	onHeroChange: (hero: Hero) => Promise<void> | void;
	onMonsterGroupCreate: (monsterGroup: MonsterGroup, sourcebook: Sourcebook | null) => void;
}
export const MainLayout = (props: Props) => {
	const location = useLocation();
	const navigate = useNavigate();
	const navigation = useNavigation();

	const { heroes } = usePersistedHeroes();
	const { sourcebooks, deleteSourcebookElement } = usePersistedSourcebooks();
	const { playbook } = usePersistedPlaybook();

	// #region Sourcebook Element Modals

	const getSourcebookElementModal = useCallback(
		<T extends Element,>(
			segments: string[],
			sourcebookElementKind: SourcebookElementKind,
			{
				listAccessor,
				getSourcebook,
				exportDefaultName,
				exportExt,
				getModal
			}: {
				listAccessor: (sourcebook: Sourcebook) => T[],
				getSourcebook: (sourcebooks: Sourcebook[], element: T) => Sourcebook | undefined,
				exportDefaultName: string,
				exportExt: string,
				getModal: (props: {
					element: T,
					sourcebook: Sourcebook,
					homebrewSourcebooks: Sourcebook[],
					isHomebrew: boolean,
					export: (format: 'image' | 'pdf' | 'json') => void,
					edit: () => void,
					delete: () => void
				}) => ReactNode
			}
		) => {
			const [ elementId ] = segments;
			const homebrewSourcebooks = sourcebooks.filter(s => s.isHomebrew);
			const element = sourcebooks.flatMap(listAccessor).find(e => e.id === elementId);
			if (!element) {
				return null;
			}
			const sourcebook = getSourcebook(sourcebooks, element)!;
			const isHomebrew = homebrewSourcebooks.flatMap(listAccessor).some(a => a.id === elementId);
			return getModal({
				element,
				sourcebook,
				homebrewSourcebooks,
				isHomebrew,
				export: format => Utils.export([ elementId ], element.name || exportDefaultName, element, exportExt, format),
				edit: () => navigation.goToLibraryEdit(sourcebook.id, sourcebookElementKind, elementId),
				delete: () => { deleteSourcebookElement(sourcebookElementKind, elementId); navigate({ hash: '' }); }
			});
		},
		[ sourcebooks, navigate, navigation, deleteSourcebookElement ]
	);

	const getAncestryModal = useCallback(
		(segments: string[]) => {
			return getSourcebookElementModal<Ancestry>(
				segments,
				'Ancestry',
				{
					listAccessor: s => s.ancestries,
					getSourcebook: SourcebookLogic.getAncestrySourcebook,
					exportDefaultName: 'Ancestry',
					exportExt: 'ancestry',
					getModal: ({
						element,
						...modalProps
					}) => <AncestryModal
						{ ...modalProps }
						ancestry={element}
						createHomebrew={sourcebook => props.onAncestryCreate(element, sourcebook)}
					/>
				}
			);
		},
		[ getSourcebookElementModal, props.onAncestryCreate ]
	);

	const getCareerModal = useCallback(
		(segments: string[]) => {
			return getSourcebookElementModal<Career>(
				segments,
				'Career',
				{
					listAccessor: s => s.careers,
					getSourcebook: SourcebookLogic.getCareerSourcebook,
					exportDefaultName: 'Career',
					exportExt: 'career',
					getModal: ({
						element,
						...modalProps
					}) => <CareerModal
						{ ...modalProps }
						career={element}
						createHomebrew={sourcebook => props.onCareerCreate(element, sourcebook)}
					/>
				}
			);
		},
		[ getSourcebookElementModal, props.onCareerCreate ]
	);

	const getClassModal = useCallback(
		(segments: string[]) => {
			return getSourcebookElementModal<HeroClass>(
				segments,
				'HeroClass',
				{
					listAccessor: s => s.classes,
					getSourcebook: SourcebookLogic.getClassSourcebook,
					exportDefaultName: 'Class',
					exportExt: 'class',
					getModal: ({
						element,
						...modalProps
					}) => <ClassModal
						{ ...modalProps }
						heroClass={element}
						createHomebrew={sourcebook => props.onClassCreate(element, sourcebook)}
					/>
				}
			);
		},
		[ getSourcebookElementModal, props.onClassCreate ]
	);

	const getComplicationModal = useCallback(
		(segments: string[]) => {
			return getSourcebookElementModal<Complication>(
				segments,
				'Complication',
				{
					listAccessor: s => s.complications,
					getSourcebook: SourcebookLogic.getComplicationSourcebook,
					exportDefaultName: 'Complication',
					exportExt: 'complication',
					getModal: ({
						element,
						...modalProps
					}) => <ComplicationModal
						{ ...modalProps }
						complication={element}
						createHomebrew={sourcebook => props.onComplicationCreate(element, sourcebook)}
					/>
				}
			);
		},
		[ getSourcebookElementModal, props.onComplicationCreate ]
	);

	const getCultureModal = useCallback(
		(segments: string[]) => {
			return getSourcebookElementModal<Culture>(
				segments,
				'Culture',
				{
					listAccessor: s => s.cultures,
					getSourcebook: SourcebookLogic.getCultureSourcebook,
					exportDefaultName: 'Culture',
					exportExt: 'culture',
					getModal: ({
						element,
						...modalProps
					}) => <CultureModal
						{ ...modalProps }
						culture={element}
						createHomebrew={sourcebook => props.onCultureCreate(element, sourcebook)}
					/>
				}
			);
		},
		[ getSourcebookElementModal, props.onCultureCreate ]
	);

	const getDomainModal = useCallback(
		(segments: string[]) => {
			return getSourcebookElementModal<Domain>(
				segments,
				'Domain',
				{
					listAccessor: s => s.domains,
					getSourcebook: SourcebookLogic.getDomainSourcebook,
					exportDefaultName: 'Domain',
					exportExt: 'domain',
					getModal: ({
						element,
						...modalProps
					}) => <DomainModal
						{ ...modalProps }
						domain={element}
						createHomebrew={sourcebook => props.onDomainCreate(element, sourcebook)}
					/>
				}
			);
		},
		[ getSourcebookElementModal, props.onDomainCreate ]
	);

	const getItemModal = useCallback(
		(segments: string[]) => {
			return getSourcebookElementModal<Item>(
				segments,
				'Item',
				{
					listAccessor: s => s.items,
					getSourcebook: SourcebookLogic.getItemSourcebook,
					exportDefaultName: 'Item',
					exportExt: 'item',
					getModal: ({
						element,
						...modalProps
					}) => <ItemModal
						{ ...modalProps }
						item={element}
						createHomebrew={sourcebook => props.onItemCreate(element, sourcebook)}
					/>
				}
			);
		},
		[ getSourcebookElementModal, props.onItemCreate ]
	);

	const getKitModal = useCallback(
		(segments: string[]) => {
			return getSourcebookElementModal<Kit>(
				segments,
				'Kit',
				{
					listAccessor: s => s.kits,
					getSourcebook: SourcebookLogic.getKitSourcebook,
					exportDefaultName: 'Kit',
					exportExt: 'kit',
					getModal: ({
						element,
						...modalProps
					}) => <KitModal
						{ ...modalProps }
						kit={element}
						createHomebrew={sourcebook => props.onKitCreate(element, sourcebook)}
					/>
				}
			);
		},
		[ getSourcebookElementModal, props.onKitCreate ]
	);

	const getPerkModal = useCallback(
		(segments: string[]) => {
			return getSourcebookElementModal<Perk>(
				segments,
				'Perk',
				{
					listAccessor: s => s.perks,
					getSourcebook: SourcebookLogic.getPerkSourcebook,
					exportDefaultName: 'Perk',
					exportExt: 'perk',
					getModal: ({
						element,
						...modalProps
					}) => <PerkModal
						{ ...modalProps }
						perk={element}
						createHomebrew={sourcebook => props.onPerkCreate(element, sourcebook)}
					/>
				}
			);
		},
		[ getSourcebookElementModal, props.onPerkCreate ]
	);

	const getTitleModal = useCallback(
		(segments: string[]) => {
			return getSourcebookElementModal<Title>(
				segments,
				'Title',
				{
					listAccessor: s => s.titles,
					getSourcebook: SourcebookLogic.getTitleSourcebook,
					exportDefaultName: 'Title',
					exportExt: 'title',
					getModal: ({
						element,
						...modalProps
					}) => <TitleModal
						{ ...modalProps }
						title={element}
						createHomebrew={sourcebook => props.onTitleCreate(element, sourcebook)}
					/>
				}
			);
		},
		[ getSourcebookElementModal, props.onTitleCreate ]
	);

	// #endregion

	const getEncounterModal = useCallback(
		(segments: string[]) => {
			const [ encounterId ] = segments as [ string ];
			const encounter = playbook.encounters.find(e => e.id === encounterId)!;
			return <EncounterModal
				encounter={encounter}
				export={format => Utils.export([ encounter.id ], encounter.name || 'Encounter', encounter, 'encounter', format)}
				edit={() => navigation.goToEncounterEdit(encounterId)}
				delete={() => props.onEncounterDelete(encounterId)}
			/>;
		},
		[ playbook, navigation, props.onEncounterDelete ]
	);

	const getHeroModal = useCallback(
		(segments: string[]) => {
			const [ heroId, heroPage, ...remainingSegments ] = segments as [ string, 'ability' | 'characteristic'| 'hero' | 'stats' | 'conditions' | 'rules', ...string[] ];
			const hero = heroes.find(h => h.id === heroId)!;
			switch (heroPage) {
				case 'ability':
					return getHeroAbilityModal(hero, remainingSegments);
				case 'characteristic':
					return getHeroCharacteristicModal(hero, remainingSegments);
				case 'hero':
				case 'stats':
				case 'conditions':
					return <HeroStateModal
						hero={hero}
						startPage={heroPage}
						onChange={props.onHeroChange}
						onLevelUp={async () => {
							if (hero && hero.class) {
								hero.class.level += 1;
								await props.onHeroChange(hero);
								navigation.goToHeroEdit(hero.id, 'Class');
							}
						}}
					/>;
				case 'rules':
					return <RulesModal hero={hero} />;
			}
		},
		[ heroes, navigation, props.onHeroChange ]
	);

	const getMonsterModal = useCallback(
		(segments: string[]) => {
			const [ monsterId ] = segments;
			const monster = SourcebookLogic.getMonster(sourcebooks, monsterId)!;
			const monsterGroup = SourcebookLogic.getMonsterGroup(sourcebooks, monsterId)!;
			return <MonsterModal
				monster={monster}
				monsterGroup={monsterGroup}
				export={format => Utils.export([ monster.id ], monster.name || 'Monster', monster, 'monster', format)}
			/>;
		},
		[ sourcebooks ]
	);

	const getMonsterGroupModal = useCallback(
		(segments: string[]) => {
			const [ monsterGroupId ] = segments;
			const homebrewSourcebooks = sourcebooks.filter(s => s.isHomebrew);
			const sourcebook = sourcebooks
				.find(cs => cs.monsterGroups.some(mg => mg.id === monsterGroupId));
			if (!sourcebook) {
				return null;
			}
			const monsterGroup = sourcebook.monsterGroups.find(mg => mg.id === monsterGroupId)!;
			return <MonsterGroupModal
				monsterGroup={monsterGroup}
				homebrewSourcebooks={homebrewSourcebooks}
				isHomebrew={sourcebook.isHomebrew}
				createHomebrew={sourcebook => props.onMonsterGroupCreate(monsterGroup, sourcebook)}
				export={format => Utils.export([ monsterGroup.id ], monsterGroup.name || 'Monster Group', monsterGroup, 'monster-group', format)}
				edit={() => navigation.goToLibraryEdit(sourcebook.id, 'MonsterGroup', monsterGroup.id)}
				delete={() => { deleteSourcebookElement('MonsterGroup', monsterGroup.id); navigate({ hash: '' }); }}
			/>;
		},
		[ sourcebooks, navigate, navigation, props.onMonsterGroupCreate, deleteSourcebookElement ]
	);

	function getHeroAbilityModal(hero: Hero, segments: string[]) {
		const [ abilityId ] = segments;
		const ability = HeroLogic.getAbilities(hero, true, true, true)
			.find(a => a.id === abilityId)!;
		return <AbilityModal ability={ability} hero={hero} />;
	}

	function getHeroCharacteristicModal(hero: Hero, segments: string[]) {
		const [ characteristic ] = segments as [ Characteristic ];
		return <CharacteristicModal characteristic={characteristic} hero={hero} />;
	}

	const drawer = useMemo(
		() => {
			// Drop leading # character
			const hash = location.hash.substring(1);
			const [ hashRoot, ...hashSegments ] = hash.split('/');
			switch (hashRoot) {
				case 'about':
					return <AboutModal />;
				case 'ancestry':
					return getAncestryModal(hashSegments);
				case 'career':
					return getCareerModal(hashSegments);
				case 'class':
					return getClassModal(hashSegments);
				case 'complication':
					return getComplicationModal(hashSegments);
				case 'culture':
					return getCultureModal(hashSegments);
				case 'domain':
					return getDomainModal(hashSegments);
				case 'encounter':
					return getEncounterModal(hashSegments);
				case 'hero':
					return getHeroModal(hashSegments);
				case 'item':
					return getItemModal(hashSegments);
				case 'kit':
					return getKitModal(hashSegments);
				case 'monster':
					return getMonsterModal(hashSegments);
				case 'monster-group':
					return getMonsterGroupModal(hashSegments);
				case 'perk':
					return getPerkModal(hashSegments);
				case 'sourcebooks':
					return <SourcebooksModal />;
				case 'title':
					return getTitleModal(hashSegments);
			}
		},
		[
			location,
			getAncestryModal,
			getCareerModal,
			getClassModal,
			getComplicationModal,
			getCultureModal,
			getDomainModal,
			getEncounterModal,
			getHeroModal,
			getItemModal,
			getKitModal,
			getMonsterModal,
			getMonsterGroupModal,
			getPerkModal,
			getTitleModal
		]
	);

	return (
		<div className='main'>
			<div className='main-content'>
				<Outlet />
			</div>
			<div className='main-footer'>
				<div className='main-footer-section'>
					<img className='ds-logo' src={pbds} />
					FORGE STEEL is an independent product published under the DRAW STEEL Creator License and is not affiliated with MCDM Productions, LLC.
					DRAW STEEL © 2024 MCDM Productions, LLC.
				</div>
				<div className='main-footer-section'>
					<Button type='text' title='Heroes' icon={<TeamOutlined />} onClick={() => navigation.goToHeroList()} />
					<Button type='text' title='Library' icon={<BookOutlined />} onClick={() => navigation.goToLibraryList()} />
					<Button type='text' title='Encounters' icon={<AimOutlined />} onClick={() => navigation.goToEncounterList()} />
				</div>
			</div>
			<Drawer open={Boolean(drawer)} onClose={() => navigate({ hash: '' })} closeIcon={null} width='500px'>
				{drawer}
			</Drawer>
		</div>
	);
};
