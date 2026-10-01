import { Card } from '../../components/ui';
import { SHEET_URL } from '../../config';

export default function ManagedInExcel() {
  return (
    <div className="max-w-xl">
      <Card className="text-center py-10">
        <div className="text-4xl mb-3">📊</div>
        <h1 className="text-xl font-extrabold text-primary mb-2">Managed in the Data Excel</h1>
        <p className="text-sm text-gray-600 mb-5">
          This information is now managed directly in the SDSA Academy Data sheet on Google Drive —
          one place for admissions, enquiries, students and announcements.
        </p>
        <a href={SHEET_URL} target="_blank" rel="noreferrer" className="btn-primary inline-block">Open Data Excel</a>
      </Card>
    </div>
  );
}
