import withRollup from 'rollup-preset-solid';
import filesize from 'rollup-plugin-filesize';

export default withRollup({
  input: 'src/index.ts',
  plugins: [filesize()],
});
