import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/storage-jar.js',
  format: 'umd',
  dest: 'dist/storage-jar.js',
  moduleName: 'StorageJar',
  plugins: [
    babel()
  ]
};
