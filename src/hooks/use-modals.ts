import type { Characteristic } from '../enums/characteristic';
import { useNavigate } from 'react-router';

export const useModals = () => {
	const navigate = useNavigate();
	return {
		showAbout() {
			return navigate({ hash: 'about' });
		},
		showAncestry(ancestryId: string) {
			return navigate({ hash: `ancestry/${ancestryId}` });
		},
		showCareer(careerId: string) {
			return navigate({ hash: `career/${careerId}` });
		},
		showClass(classId: string) {
			return navigate({ hash: `class/${classId}` });
		},
		showComplication(complicationId: string) {
			return navigate({ hash: `complication/${complicationId}` });
		},
		showCulture(cultureId: string) {
			return navigate({ hash: `culture/${cultureId}` });
		},
		showDomain(domainId: string) {
			return navigate({ hash: `domain/${domainId}` });
		},
		showEncounter(encounterId: string) {
			return navigate({ hash: `encounter/${encounterId}` });
		},
		showHeroAbility(heroId: string, abilityId: string) {
			return navigate({ hash: `hero/${heroId}/ability/${abilityId}` });
		},
		showHeroCharacteristic(heroId: string, characteristic: Characteristic) {
			return navigate({ hash: `hero/${heroId}/characteristic/${characteristic}` });
		},
		showHeroRules(heroId: string) {
			return navigate({ hash: `hero/${heroId}/rules` });
		},
		showHeroState(heroId: string, page: 'hero' | 'stats' | 'conditions') {
			return navigate({ hash: `hero/${heroId}/${page}` });
		},
		showItem(itemId: string) {
			return navigate({ hash: `item/${itemId}` });
		},
		showKit(kitId: string) {
			return navigate({ hash: `kit/${kitId}` });
		},
		showMonster(monsterId: string) {
			return navigate({ hash: `monster/${monsterId}` });
		},
		showMonsterGroup(monsterGroupId: string) {
			return navigate({ hash: `monster-group/${monsterGroupId}` });
		},
		showPerk(perkId: string) {
			return navigate({ hash: `perk/${perkId}` });
		},
		showSourcebooks() {
			return navigate({ hash: 'sourcebooks' });
		},
		showTitle(titleId: string) {
			return navigate({ hash: `title/${titleId}` });
		}
	};
};
