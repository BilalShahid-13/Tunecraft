import { taskManagmentList } from '@/lib/Constant';
import AdminTabRoot from '../../components/AdminTabRoot';
import AllCrafters from './CraftersTab/AllCrafters';
import PendingCrafters from './CraftersTab/PendingCrafters';
import ApprovedCrafter from './CraftersTab/ApprovedCrafter';

const componentLists = [
  AllCrafters,
  PendingCrafters,
  ApprovedCrafter
]
export default function TaskManagmentLayout() {


  return (
    <>
      <AdminTabRoot
        list={taskManagmentList}
        gridSize={3}
        componentLists={componentLists} />
    </>
  )
}
