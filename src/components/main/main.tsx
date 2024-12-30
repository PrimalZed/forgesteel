import { Navigate, Route, Routes, useLocation } from 'react-router';
import { ReactNode, useState } from 'react';
import { Ancestry } from '../../models/ancestry';
import { Career } from '../../models/career';
import { Collections } from '../../utils/collections';
import { Complication } from '../../models/complication';
import { Culture } from '../../models/culture';
import { Domain } from '../../models/domain';
import { DomainModal } from '../modals/domain/domain-modal';
import { Element } from '../../models/element';
import { Encounter } from '../../models/encounter';
import { EncounterEditPage } from '../pages/encounters/encounter-edit/encounter-edit';
import { EncounterListPage } from '../pages/encounters/encounter-list/encounter-list';
import { FactoryLogic } from '../../logic/factory-logic';
import { Hero } from '../../models/hero';
import { HeroClass } from '../../models/class';
import { HeroEditPage } from '../pages/heroes/hero-edit/hero-edit-page';
import { HeroListPage } from '../pages/heroes/hero-list/hero-list-page';
import { HeroPage } from '../pages/heroes/hero-view/hero-view-page';
import { Item } from '../../models/item';
import { ItemModal } from '../modals/item/item-modal';
import { Kit } from '../../models/kit';
import { KitModal } from '../modals/kit/kit-modal';
import { LibraryEditPage } from '../pages/library/library-edit/library-edit';
import { LibraryListPage } from '../pages/library/library-list/library-list';
import { MainLayout } from './main-layout';
import { MonsterGroup } from '../../models/monster';
import { Perk } from '../../models/perk';
import { PerkModal } from '../modals/perk/perk-modal';
import { Playbook } from '../../models/playbook';
import { Sourcebook } from '../../models/sourcebook';
import { SourcebookData } from '../../data/sourcebook-data';
import { SourcebookElementKind } from '../../models/sourcebook-element-kind';
import { SourcebookElementsKey } from '../../models/sourcebook-elements-key';
import { Title } from '../../models/title';
import { TitleModal } from '../modals/title/title-modal';
import { Utils } from '../../utils/utils';
import { WelcomePage } from '../pages/welcome/welcome-page';
import { getSourcebookKey } from '../../utils/get-sourcebook-key';
import { useModals } from '../../hooks/use-modals';
import { useNavigation } from '../../hooks/use-navigation';
import { usePersistedHeroes } from '../../hooks/use-persisted-heroes';
import { usePersistedPlaybook } from '../../hooks/use-persisted-playbook';
import { usePersistedSourcebooks } from '../../hooks/use-persisted-sourcebooks';

import './main.scss';

export const Main = () => {
	const location = useLocation();
	const navigation = useNavigation();
	const modals = useModals();
	const { heroes, persistHero } = usePersistedHeroes();
	const { sourcebooks, homebrewSourcebooks, persistHomebrewSourcebooks, deleteSourcebookElement } = usePersistedSourcebooks();
	const { playbook, persistPlaybook } = usePersistedPlaybook();
	const [ _, setDrawer ] = useState<ReactNode>(null);

	//#region Heroes

	const addHero = async () => {
		const hero = FactoryLogic.createHero([
			SourcebookData.core.id,
			SourcebookData.orden.id
		]);

		await persistHero(hero);
		navigation.goToHeroEdit(hero.id);
	};

	const closeHero = () => {
		navigation.goToHeroList();
	};

	const editHero = (heroId: string) => {
		navigation.goToHeroEdit(heroId);
	};

	const saveEditHero = async (hero: Hero) => {
		await persistHero(hero);
		navigation.goToHeroView(hero.id);
	};

	const cancelEditHero = (heroId: string) => {
		navigation.goToHeroView(heroId);
	};

	//#endregion

	//#region Library

	const createHomebrewElement = async (type: SourcebookElementKind, sourcebookID: string | null) => {
		const sourcebook = homebrewSourcebooks.find(cs => cs.id === sourcebookID) || null;
		switch (type) {
			case 'Ancestry':
				await createAncestry(null, sourcebook);
				break;
			case 'Culture':
				await createCulture(null, sourcebook);
				break;
			case 'Career':
				await createCareer(null, sourcebook);
				break;
			case 'HeroClass':
				await createClass(null, sourcebook);
				break;
			case 'Complication':
				await createComplication(null, sourcebook);
				break;
			case 'Kit':
				await createKit(null, sourcebook);
				break;
			case 'Perk':
				await createPerk(null, sourcebook);
				break;
			case 'Title':
				await createTitle(null, sourcebook);
				break;
			case 'Item':
				await createItem(null, sourcebook);
				break;
			case 'MonsterGroup':
				await createMonsterGroup(null, sourcebook);
				break;
		}
	};

	const importHomebrewElement = async (kind: SourcebookElementKind, sourcebookID: string | null, element: Element) => {
		element.id = Utils.guid();

		const sourcebooks = JSON.parse(JSON.stringify(homebrewSourcebooks)) as Sourcebook[];
		let sourcebook = sourcebooks.find(cs => cs.id === sourcebookID);
		if (!sourcebook) {
			sourcebook = FactoryLogic.createSourcebook();
			sourcebooks.push(sourcebook);
		}
		const sourcebookKey = getSourcebookKey(kind);
		(sourcebook as Record<SourcebookElementsKey, Element[]>)[sourcebookKey].push(element);
		Collections.sort<Element>(sourcebook[sourcebookKey], item => item.name);

		await persistHomebrewSourcebooks(sourcebooks);
		navigation.goToLibraryList();
	};

	const createAncestry = async (original: Ancestry | null, sourcebook: Sourcebook | null) => {
		const sourcebooks = JSON.parse(JSON.stringify(homebrewSourcebooks)) as Sourcebook[];
		if (!sourcebook) {
			sourcebook = FactoryLogic.createSourcebook();
			sourcebooks.push(sourcebook);
		} else {
			const id = sourcebook.id;
			sourcebook = sourcebooks.find(cs => cs.id === id) as Sourcebook;
		}

		let ancestry: Ancestry;
		if (original) {
			ancestry = JSON.parse(JSON.stringify(original)) as Ancestry;
			ancestry.id = Utils.guid();
		} else {
			ancestry = FactoryLogic.createAncestry();
		}

		sourcebook.ancestries.push(ancestry);
		await persistHomebrewSourcebooks(sourcebooks);
		if (location.hash) {
			modals.showAncestry(ancestry.id);
		} else {
			navigation.goToLibraryEdit(sourcebook.id, 'Ancestry', ancestry.id);
		}
	};

	const createCulture = async (original: Culture | null, sourcebook: Sourcebook | null) => {
		const sourcebooks = JSON.parse(JSON.stringify(homebrewSourcebooks)) as Sourcebook[];
		if (!sourcebook) {
			sourcebook = FactoryLogic.createSourcebook();
			sourcebooks.push(sourcebook);
		} else {
			const id = sourcebook.id;
			sourcebook = sourcebooks.find(cs => cs.id === id) as Sourcebook;
		}

		let culture: Culture;
		if (original) {
			culture = JSON.parse(JSON.stringify(original)) as Culture;
			culture.id = Utils.guid();
		} else {
			culture = FactoryLogic.createCulture();
		}

		sourcebook.cultures.push(culture);
		await persistHomebrewSourcebooks(sourcebooks);
		if (location.hash) {
			modals.showCulture(culture.id);
		} else {
			navigation.goToLibraryEdit(sourcebook.id, 'Culture', culture.id);
		}
	};

	const createCareer = async (original: Career | null, sourcebook: Sourcebook | null) => {
		const sourcebooks = JSON.parse(JSON.stringify(homebrewSourcebooks)) as Sourcebook[];
		if (!sourcebook) {
			sourcebook = FactoryLogic.createSourcebook();
			sourcebooks.push(sourcebook);
		} else {
			const id = sourcebook.id;
			sourcebook = sourcebooks.find(cs => cs.id === id) as Sourcebook;
		}

		let career: Career;
		if (original) {
			career = JSON.parse(JSON.stringify(original)) as Career;
			career.id = Utils.guid();
		} else {
			career = FactoryLogic.createCareer();
		}

		sourcebook.careers.push(career);
		await persistHomebrewSourcebooks(sourcebooks);
		if (location.hash) {
			modals.showCareer(career.id);
		} else {
			navigation.goToLibraryEdit(sourcebook.id, 'Career', career.id);
		}
	};

	const createClass = async (original: HeroClass | null, sourcebook: Sourcebook | null) => {
		const sourcebooks = JSON.parse(JSON.stringify(homebrewSourcebooks)) as Sourcebook[];
		if (!sourcebook) {
			sourcebook = FactoryLogic.createSourcebook();
			sourcebooks.push(sourcebook);
		} else {
			const id = sourcebook.id;
			sourcebook = sourcebooks.find(cs => cs.id === id) as Sourcebook;
		}

		let heroClass: HeroClass;
		if (original) {
			heroClass = JSON.parse(JSON.stringify(original)) as HeroClass;
			heroClass.id = Utils.guid();
		} else {
			heroClass = FactoryLogic.createClass();
		}

		sourcebook.classes.push(heroClass);
		await persistHomebrewSourcebooks(sourcebooks);
		if (location.hash) {
			modals.showClass(heroClass.id);
		} else {
			navigation.goToLibraryEdit(sourcebook.id, 'HeroClass', heroClass.id);
		}
	};

	const createComplication = async (original: Complication | null, sourcebook: Sourcebook | null) => {
		const sourcebooks = JSON.parse(JSON.stringify(homebrewSourcebooks)) as Sourcebook[];
		if (!sourcebook) {
			sourcebook = FactoryLogic.createSourcebook();
			sourcebooks.push(sourcebook);
		} else {
			const id = sourcebook.id;
			sourcebook = sourcebooks.find(cs => cs.id === id) as Sourcebook;
		}

		let complication: Complication;
		if (original) {
			complication = JSON.parse(JSON.stringify(original)) as Complication;
			complication.id = Utils.guid();
		} else {
			complication = FactoryLogic.createComplication();
		}

		sourcebook.complications.push(complication);
		persistHomebrewSourcebooks(sourcebooks);
		if (location.hash) {
			modals.showComplication(complication.id);
		} else {
			navigation.goToLibraryEdit(sourcebook.id, 'Complication', complication.id);
		}
	};

	const createDomain = async (original: Domain | null, sourcebook: Sourcebook | null) => {
		const sourcebooks = JSON.parse(JSON.stringify(homebrewSourcebooks)) as Sourcebook[];
		if (!sourcebook) {
			sourcebook = FactoryLogic.createSourcebook();
			sourcebooks.push(sourcebook);
		} else {
			const id = sourcebook.id;
			sourcebook = sourcebooks.find(cs => cs.id === id) as Sourcebook;
		}

		let domain: Domain;
		if (original) {
			domain = JSON.parse(JSON.stringify(original)) as Domain;
			domain.id = Utils.guid();
		} else {
			domain = FactoryLogic.createDomain();
		}

		sourcebook.domains.push(domain);
		await persistHomebrewSourcebooks(sourcebooks);
		if (location.hash) {
			onSelectDomain(domain);
		} else {
			editDomain(domain, sourcebook);
		}
	};

	const createKit = async (original: Kit | null, sourcebook: Sourcebook | null) => {
		const sourcebooks = JSON.parse(JSON.stringify(homebrewSourcebooks)) as Sourcebook[];
		if (!sourcebook) {
			sourcebook = FactoryLogic.createSourcebook();
			sourcebooks.push(sourcebook);
		} else {
			const id = sourcebook.id;
			sourcebook = sourcebooks.find(cs => cs.id === id) as Sourcebook;
		}

		let kit: Kit;
		if (original) {
			kit = JSON.parse(JSON.stringify(original)) as Kit;
			kit.id = Utils.guid();
		} else {
			kit = FactoryLogic.createKit();
		}

		sourcebook.kits.push(kit);
		await persistHomebrewSourcebooks(sourcebooks);
		if (location.hash) {
			onSelectKit(kit);
		} else {
			editKit(kit, sourcebook);
		}
	};

	const createPerk = async (original: Perk | null, sourcebook: Sourcebook | null) => {
		const sourcebooks = JSON.parse(JSON.stringify(homebrewSourcebooks)) as Sourcebook[];
		if (!sourcebook) {
			sourcebook = FactoryLogic.createSourcebook();
			sourcebooks.push(sourcebook);
		} else {
			const id = sourcebook.id;
			sourcebook = sourcebooks.find(cs => cs.id === id) as Sourcebook;
		}

		let perk: Perk;
		if (original) {
			perk = JSON.parse(JSON.stringify(original)) as Perk;
			perk.id = Utils.guid();
		} else {
			perk = FactoryLogic.createPerk();
		}

		sourcebook.perks.push(perk);
		await persistHomebrewSourcebooks(sourcebooks);
		if (location.hash) {
			onSelectPerk(perk);
		} else {
			editPerk(perk, sourcebook);
		}
	};

	const createTitle = async (original: Title | null, sourcebook: Sourcebook | null) => {
		const sourcebooks = JSON.parse(JSON.stringify(homebrewSourcebooks)) as Sourcebook[];
		if (!sourcebook) {
			sourcebook = FactoryLogic.createSourcebook();
			sourcebooks.push(sourcebook);
		} else {
			const id = sourcebook.id;
			sourcebook = sourcebooks.find(cs => cs.id === id) as Sourcebook;
		}

		let title: Title;
		if (original) {
			title = JSON.parse(JSON.stringify(original)) as Title;
			title.id = Utils.guid();
		} else {
			title = FactoryLogic.createTitle();
		}

		sourcebook.titles.push(title);
		await persistHomebrewSourcebooks(sourcebooks);
		if (location.hash) {
			onSelectTitle(title);
		} else {
			editTitle(title, sourcebook);
		}
	};

	const createItem = async (original: Item | null, sourcebook: Sourcebook | null) => {
		const sourcebooks = JSON.parse(JSON.stringify(homebrewSourcebooks)) as Sourcebook[];
		if (!sourcebook) {
			sourcebook = FactoryLogic.createSourcebook();
			sourcebooks.push(sourcebook);
		} else {
			const id = sourcebook.id;
			sourcebook = sourcebooks.find(cs => cs.id === id) as Sourcebook;
		}

		let item: Item;
		if (original) {
			item = JSON.parse(JSON.stringify(original)) as Item;
			item.id = Utils.guid();
		} else {
			item = FactoryLogic.createItem();
		}

		sourcebook.items.push(item);
		await persistHomebrewSourcebooks(sourcebooks);
		if (location.hash) {
			onSelectItem(item);
		} else {
			editItem(item, sourcebook);
		}
	};

	const createMonsterGroup = async (original: MonsterGroup | null, sourcebook: Sourcebook | null) => {
		const sourcebooks = JSON.parse(JSON.stringify(homebrewSourcebooks)) as Sourcebook[];
		if (!sourcebook) {
			sourcebook = FactoryLogic.createSourcebook();
			sourcebooks.push(sourcebook);
		} else {
			const id = sourcebook.id;
			sourcebook = sourcebooks.find(cs => cs.id === id) as Sourcebook;
		}

		let monsterGroup: MonsterGroup;
		if (original) {
			monsterGroup = JSON.parse(JSON.stringify(original)) as MonsterGroup;
			monsterGroup.id = Utils.guid();
		} else {
			monsterGroup = FactoryLogic.createMonsterGroup();
		}

		sourcebook.monsterGroups.push(monsterGroup);
		await persistHomebrewSourcebooks(sourcebooks);
		if (location.hash) {
			modals.showMonsterGroup(monsterGroup.id);
		} else {
			navigation.goToLibraryEdit(sourcebook.id, 'MonsterGroup', monsterGroup.id);
		}
	};

	function editHomebrewElement(kind: 'Ancestry', element: Ancestry, sourcebook: Sourcebook): void;
	function editHomebrewElement(kind: 'Culture', element: Culture, sourcebook: Sourcebook): void;
	function editHomebrewElement(kind: 'Career', element: Career, sourcebook: Sourcebook): void;
	function editHomebrewElement(kind: 'HeroClass', element: HeroClass, sourcebook: Sourcebook): void;
	function editHomebrewElement(kind: 'Complication', element: Complication, sourcebook: Sourcebook): void;
	function editHomebrewElement(kind: 'Domain', element: Domain, sourcebook: Sourcebook): void;
	function editHomebrewElement(kind: 'Kit', element: Kit, sourcebook: Sourcebook): void;
	function editHomebrewElement(kind: 'Perk', element: Perk, sourcebook: Sourcebook): void;
	function editHomebrewElement(kind: 'Title', element: Title, sourcebook: Sourcebook): void;
	function editHomebrewElement(kind: 'Item', element: Item, sourcebook: Sourcebook): void;
	function editHomebrewElement(kind: 'MonsterGroup', element: MonsterGroup, sourcebook: Sourcebook): void;
	function editHomebrewElement(
		kind: SourcebookElementKind,
		element: Ancestry | Culture | Career | HeroClass | Complication | Domain | Kit | Perk | Title | Item | MonsterGroup,
		sourcebook: Sourcebook
	) {
		navigation.goToLibraryEdit(sourcebook.id, kind, element.id);
	}

	const editDomain = (domain: Domain, sourcebook: Sourcebook) => {
		editHomebrewElement('Domain', domain, sourcebook);
	};

	const editKit = (kit: Kit, sourcebook: Sourcebook) => {
		editHomebrewElement('Kit', kit, sourcebook);
	};

	const editPerk = (perk: Perk, sourcebook: Sourcebook) => {
		editHomebrewElement('Perk', perk, sourcebook);
	};

	const editTitle = (title: Title, sourcebook: Sourcebook) => {
		editHomebrewElement('Title', title, sourcebook);
	};

	const editItem = (item: Item, sourcebook: Sourcebook) => {
		editHomebrewElement('Item', item, sourcebook);
	};

	const saveEditElement = async (sourcebookId: string, kind: SourcebookElementKind, element: Element) => {
		const list = JSON.parse(JSON.stringify(homebrewSourcebooks)) as Sourcebook[];
		const sourcebook = list.find(cs => cs.id === sourcebookId) as Record<SourcebookElementsKey, Element[]>;
		if (sourcebook) {
			const elementKey = getSourcebookKey(kind);
			sourcebook[elementKey] = sourcebook[elementKey].map(x => x.id === element.id ? element : x);
		}

		await persistHomebrewSourcebooks(list);
		navigation.goToLibraryList(kind);
	};

	//#endregion

	//#region Encounters

	const createEncounter = async (original: Encounter | null) => {
		const copy = JSON.parse(JSON.stringify(playbook)) as Playbook;

		let encounter: Encounter;
		if (original) {
			encounter = JSON.parse(JSON.stringify(original)) as Encounter;
			encounter.id = Utils.guid();
		} else {
			encounter = FactoryLogic.createEncounter();
		}

		copy.encounters.push(encounter);
		await persistPlaybook(copy);
		navigation.goToEncounterEdit(encounter.id);
	};

	const importEncounter = async (encounter: Encounter) => {
		encounter.id = Utils.guid();

		const copy = JSON.parse(JSON.stringify(playbook)) as Playbook;
		copy.encounters.push(encounter);
		Collections.sort(copy.encounters, item => item.name);

		await persistPlaybook(copy);
		navigation.goToEncounterList();
	};

	const deleteEncounter = async (encounterId: string) => {
		const copy = JSON.parse(JSON.stringify(playbook)) as Playbook;
		copy.encounters = copy.encounters.filter(enc => enc.id !== encounterId);

		await persistPlaybook(copy);
		navigation.goToEncounterList();
	};

	const saveEditEncounter = async (encounter: Encounter) => {
		const copy = JSON.parse(JSON.stringify(playbook)) as Playbook;
		const encounterIndex = copy.encounters.findIndex(enc => enc.id === encounter.id);
		if (encounterIndex !== -1) {
			copy.encounters[encounterIndex] = encounter;
		}

		await persistPlaybook(copy);
		navigation.goToEncounterList();
	};

	const cancelEditEncounter = () => {
		navigation.goToEncounterList();
	};

	//#endregion

	//#region Modals

	const onSelectDomain = (domain: Domain) => {
		const container = sourcebooks.find(cs => cs.domains.find(d => d.id === domain.id))!;

		setDrawer(
			<DomainModal
				domain={domain}
				homebrewSourcebooks={homebrewSourcebooks}
				isHomebrew={!!homebrewSourcebooks.flatMap(cs => cs.domains).find(d => d.id === domain.id)}
				createHomebrew={sourcebook => createDomain(domain, sourcebook)}
				export={format => Utils.export([ domain.id ], domain.name || 'Domain', domain, 'domain', format)}
				edit={() => editDomain(domain, container)}
				delete={() => deleteSourcebookElement('Domain', domain.id)}
			/>
		);
	};

	const onSelectKit = (kit: Kit) => {
		const container = sourcebooks.find(cs => cs.kits.find(k => k.id === kit.id))!;

		setDrawer(
			<KitModal
				kit={kit}
				homebrewSourcebooks={homebrewSourcebooks}
				isHomebrew={!!homebrewSourcebooks.flatMap(cs => cs.kits).find(k => k.id === kit.id)}
				createHomebrew={sourcebook => createKit(kit, sourcebook)}
				export={format => Utils.export([ kit.id ], kit.name || 'Kit', kit, 'kit', format)}
				edit={() => editKit(kit, container)}
				delete={() => deleteSourcebookElement('Kit', kit.id)}
			/>
		);
	};

	const onSelectPerk = (perk: Perk) => {
		const container = sourcebooks.find(cs => cs.perks.find(p => p.id === perk.id))!;

		setDrawer(
			<PerkModal
				perk={perk}
				homebrewSourcebooks={homebrewSourcebooks}
				isHomebrew={!!homebrewSourcebooks.flatMap(cs => cs.perks).find(p => p.id === perk.id)}
				createHomebrew={sourcebook => createPerk(perk, sourcebook)}
				export={format => Utils.export([ perk.id ], perk.name || 'Perk', perk, 'perk', format)}
				edit={() => editPerk(perk, container)}
				delete={() => deleteSourcebookElement('Perk', perk.id)}
			/>
		);
	};

	const onSelectTitle = (title: Title) => {
		const container = sourcebooks.find(cs => cs.titles.find(t => t.id === title.id))!;

		setDrawer(
			<TitleModal
				title={title}
				homebrewSourcebooks={homebrewSourcebooks}
				isHomebrew={!!homebrewSourcebooks.flatMap(cs => cs.titles).find(t => t.id === title.id)}
				createHomebrew={sourcebook => createTitle(title, sourcebook)}
				export={format => Utils.export([ title.id ], title.name || 'Title', title, 'title', format)}
				edit={() => editTitle(title, container)}
				delete={() => deleteSourcebookElement('Title', title.id)}
			/>
		);
	};

	const onSelectItem = (item: Item) => {
		const container = sourcebooks.find(cs => cs.items.find(i => i.id === item.id))!;

		setDrawer(
			<ItemModal
				item={item}
				homebrewSourcebooks={homebrewSourcebooks}
				isHomebrew={!!homebrewSourcebooks.flatMap(cs => cs.items).find(i => i.id === item.id)}
				createHomebrew={sourcebook => createItem(item, sourcebook)}
				export={format => Utils.export([ item.id ], item.name || 'Item', item, 'item', format)}
				edit={() => editItem(item, container)}
				delete={() => deleteSourcebookElement('Item', item.id)}
			/>
		);
	};

	//#endregion

	return (
		<Routes>
			<Route
				path={navigation.rootRoute}
				element={
					<MainLayout
						onAncestryCreate={createAncestry}
						onCareerChange={createCareer}
						onClassChange={createClass}
						onComplicationChange={createComplication}
						onCultureCreate={createCulture}
						onHeroChange={persistHero}
						onEncounterDelete={deleteEncounter}
						onMonsterGroupCreate={createMonsterGroup}
					/>
				}>
				<Route
					index={true}
					element={
						<WelcomePage
							showHeroes={heroes.length === 0 ? addHero : navigation.goToHeroList}
							showLibrary={() => navigation.goToLibraryList()}
							showEncounters={navigation.goToEncounterList}
						/>
					}
				/>
				<Route path='hero'>
					<Route
						index={true}
						element={<Navigate to='list' replace={true} />}
					/>
					<Route
						path='list'
						element={
							<HeroListPage
								goHome={navigation.goToWelcome}
								addHero={addHero}
							/>
						}
					/>
					<Route
						path='view/:heroId'
						element={
							<HeroPage
								goHome={navigation.goToWelcome}
								closeHero={closeHero}
								editHero={editHero}
								onSelectDomain={onSelectDomain}
								onSelectKit={onSelectKit}
							/>
						}
					/>
					<Route
						path='edit/:heroId'
						element={<Navigate to='Ancestry' replace={true} />}
					/>
					<Route
						path='edit/:heroId/:tab'
						element={
							<HeroEditPage
								goHome={navigation.goToWelcome}
								saveChanges={saveEditHero}
								cancelChanges={cancelEditHero}
							/>
						}
					/>
				</Route>
				<Route path='library'>
					<Route
						index={true}
						element={<Navigate to='list' replace={true} />}
					/>
					<Route
						path='list'
						element={<Navigate to='Ancestry' replace={true} />}
					/>
					<Route
						path='list/:tab'
						element={
							<LibraryListPage
								goHome={navigation.goToWelcome}
								viewDomain={onSelectDomain}
								viewKit={onSelectKit}
								viewPerk={onSelectPerk}
								viewTitle={onSelectTitle}
								viewItem={onSelectItem}
								onCreateHomebrew={createHomebrewElement}
								onImportHomebrew={importHomebrewElement}
							/>
						}
					/>
					<Route
						path='edit/:sourcebookId/:kind/:elementId'
						element={
							<LibraryEditPage
								goHome={navigation.goToWelcome}
								saveChanges={saveEditElement}
							/>
						}
					/>
				</Route>
				<Route path='encounter'>
					<Route
						index={true}
						element={<Navigate to='list' replace={true} />}
					/>
					<Route
						path='list'
						element={
							<EncounterListPage
								goHome={navigation.goToWelcome}
								onCreateEncounter={() => createEncounter(null)}
								onImportEncounter={importEncounter}
							/>
						}
					/>
					<Route
						path='edit/:encounterId'
						element={
							<EncounterEditPage
								goHome={navigation.goToWelcome}
								saveChanges={saveEditEncounter}
								cancelChanges={cancelEditEncounter}
							/>
						}
					/>
				</Route>
			</Route>
		</Routes>
	);
};
