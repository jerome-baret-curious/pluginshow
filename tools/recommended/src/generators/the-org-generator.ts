import { runTasksInSerial, Tree, updateJson } from '@nx/devkit';
import { TheOrgGeneratorSchema } from './schema';
import {
  libraryGenerator,
  storybookConfigurationGenerator,
  UnitTestRunner,
} from '@nx/angular/generators';

export async function theOrgLibraryGenerator(
  tree: Tree,
  options: TheOrgGeneratorSchema
) {
  const tasks = [];
  tasks.push(
    await libraryGenerator(tree, {
      ...options,
      style: 'css',
      unitTestRunner: UnitTestRunner.None,
    })
  );
  await storybookConfigurationGenerator(tree, {
    ...options,
    generateStories: false,
    linter: 'none',
    project: options.name,
  });

  updateTsConfiguration(tree, options.directory);

  return runTasksInSerial(...tasks);
}

function updateTsConfiguration(tree: Tree, directory: string) {
  updateJson(tree, `${directory}/tsconfig.json`, (tsJson) => {
    if (!tsJson.compilerOptions || !tsJson.compilerOptions.target) {
      return tsJson;
    }

    tsJson.compilerOptions.target = 'es2023';
    return tsJson;
  });
}

export default theOrgLibraryGenerator;
