import { BrowserRouter } from 'react-router';
import { FactoryLogic } from './logic/factory-logic.ts';
import { Main } from './components/main/main.tsx';
import { Options } from './models/options.ts';
import { Playbook } from './models/playbook.ts';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import localforage from 'localforage';

import './index.scss';

const promises = [
	localforage.getItem<Playbook>('forgesteel-playbook'),
	localforage.getItem<Options>('forgesteel-options')
] as const;

Promise.all(promises).then(([ playbook, options ]) => {
	if (!playbook) {
		playbook = FactoryLogic.createPlaybook();
	}

	if (!options) {
		options = {
			showSkillsInGroups: false,
			showFreeStrikes: false,
			showStandardAbilities: false,
			dimUnavailableAbilities: false
		};
	}

	createRoot(document.getElementById('root')!).render(
		<StrictMode>
			<BrowserRouter>
				<Main
					playbook={playbook}
					options={options}
				/>
			</BrowserRouter>
		</StrictMode>
	);
});
