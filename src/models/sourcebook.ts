import { Ancestry } from './ancestry';
import { Career } from './career';
import { Complication } from './complication';
import { Culture } from './culture';
import { Domain } from './domain';
import { Element } from './element';
import { HeroClass } from './class';
import { Item } from './item';
import { Kit } from './kit';
import { Language } from './language';
import { Perk } from './perk';
import { Skill } from './skill';

export interface Sourcebook extends Element {
	isHomebrew: boolean;
	ancestries: Ancestry[];
	cultures: Culture[];
	careers: Career[];
	classes: HeroClass[];
	complications: Complication[];
	domains: Domain[];
	kits: Kit[];
	perks: Perk[];
	items: Item[];
	skills: Skill[];
	languages: Language[];
	defaultLanguages: string[];
}