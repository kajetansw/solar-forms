import withRollup from 'rollup-preset-solid';
import filesize from 'rollup-plugin-filesize';
import { terser } from 'rollup-plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default withRollup({
  input: 'src/index.ts',
  plugins: [peerDepsExternal(), terser(), filesize()],
});
