import { taskManagmentList } from '@/lib/Constant';
import AdminTabRoot from '../../(CrafterManagment)/components/AdminTabRoot';
import { lazy } from 'react';

const AllCrafters = lazy(() => import('./CraftersTab/AllCrafters'));
const PendingCrafters = lazy(() => import('./CraftersTab/PendingCrafters'));
const ApprovedCrafter = lazy(() => import('./CraftersTab/ApprovedCrafter'));

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
