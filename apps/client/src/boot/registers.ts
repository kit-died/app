import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import { use } from 'echarts/core'
import { BarChart, ScatterChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent, TitleComponent, GraphicComponent, DatasetComponent, DataZoomComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
dayjs.extend(duration)
dayjs.extend(relativeTime)

use([
  ScatterChart,
  BarChart,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  // VisualMapContinuousComponent,
  GraphicComponent,
  // TransformComponent,
  // VisualMapPiecewiseComponent,
  DatasetComponent,
  CanvasRenderer,
  // SVGRenderer,
  // ToolboxComponent,
  DataZoomComponent
])
