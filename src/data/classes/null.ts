import { Characteristic } from '../../enums/characteristic';
import { FeatureField } from '../../enums/feature-field';
import { FeatureLogic } from '../../logic/feature-logic';
import { HeroClass } from '../../models/class';

export const nullClass: HeroClass = {
	id: 'class-null',
	name: 'Null',
	description: 'The mind is not separate from the body. Perfection of one requires perfection of the other. You strive for perfect discipline, perfect order, mastery over mind and body. You require no weapons, no tools. Any tool can be turned against the hand that wields it. You suffice.',
	heroicResource: 'Discipline',
	subclassName: 'Tradition',
	subclassCount: 1,
	primaryCharacteristics: [ Characteristic.Agility, Characteristic.Intuition ],
	featuresByLevel: [
		{
			level: 1,
			features: [
				FeatureLogic.feature.createBonusFeature({
					id: 'null-stamina',
					field: FeatureField.Stamina,
					value: 21,
					valuePerLevel: 9
				}),
				FeatureLogic.feature.createBonusFeature({
					id: 'null-recoveries',
					field: FeatureField.Recoveries,
					value: 8
				}),
				FeatureLogic.feature.createClassAbilityChoiceFeature({
					id: 'null-1-6',
					cost: 0
				}),
				FeatureLogic.feature.createClassAbilityChoiceFeature({
					id: 'null-1-7',
					cost: 3
				}),
				FeatureLogic.feature.createClassAbilityChoiceFeature({
					id: 'null-1-8',
					cost: 5
				})
			]
		},
		{
			level: 2,
			features: []
		},
		{
			level: 3,
			features: []
		}
	],
	abilities: [
	],
	subclasses: [
	],
	level: 1,
	characteristics: []
};
