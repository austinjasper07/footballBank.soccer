'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchBar } from '@/components/admin/SearchBar';
import { PlayerDialog } from '@/components/admin/dialogs/PlayerDialog';
import { useToast } from '@/hooks/use-toast';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import { getAllPlayers, updatePlayer, deletePlayer } from '@/actions/adminActions';
import { calculateAge } from '@/utils/dateHelper';

const ITEMS_PER_PAGE = 5;

export default function PlayersView() {
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');
  const [playerDialogOpen, setPlayerDialogOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await getAllPlayers();
        setPlayers(response);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };
    fetchPlayers();
  }, []);

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const search = searchQuery.toLowerCase();
      const firstName = player.firstName?.toLowerCase() || '';
      const lastName = player.lastName?.toLowerCase() || '';
      const country = player.country?.toLowerCase() || '';
      const position = player.position?.toLowerCase() || '';

      return (
        (firstName.includes(search) ||
          lastName.includes(search) ||
          country.includes(search)) &&
        (countryFilter === 'all' || country.includes(countryFilter.toLowerCase())) &&
        (positionFilter === 'all' || position === positionFilter.toLowerCase())
      );
    });
  }, [players, searchQuery, countryFilter, positionFilter]);

  const paginatedPlayers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPlayers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPlayers, currentPage]);

  const totalPages = Math.ceil(filteredPlayers.length / ITEMS_PER_PAGE);

  const handleDeletePlayer = async (id) => {
    try {
      await deletePlayer(id);
      toast({
        title: 'Player Deleted',
        description: 'The player has been removed successfully.',
      });
      const updated = await getAllPlayers();
      setPlayers(updated);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete player.',
        variant: 'destructive',
      });
    }
  };

  const handleEditPlayer = (player) => {
    setEditingPlayer(player);
    setPlayerDialogOpen(true);
  };

  const handleAddOrUpdatePlayer = async (data) => {
    if (!data.id) {
      toast({
        title: 'Error',
        description: 'New player creation is not implemented yet.',
        variant: 'destructive',
      });
      return;
    }

    await updatePlayer(data.id, data);
    const updated = await getAllPlayers();
    setPlayers(updated);

    toast({
      title: 'Success',
      description: 'Player updated successfully.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex md:items-center justify-between">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search players..."
            className="w-40 md:w-80"
          />
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              <SelectItem value="brazil">Brazil</SelectItem>
              <SelectItem value="argentina">Argentina</SelectItem>
              <SelectItem value="spain">Spain</SelectItem>
              <SelectItem value="france">France</SelectItem>
            </SelectContent>
          </Select>

          <Select value={positionFilter} onValueChange={setPositionFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Positions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Positions</SelectItem>
              <SelectItem value="goalkeeper">Goalkeeper</SelectItem>
              <SelectItem value="defender">Defender</SelectItem>
              <SelectItem value="midfielder">Midfielder</SelectItem>
              <SelectItem value="forward">Forward</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={() => setPlayerDialogOpen(true)}
          className="bg-[hsl(210,74%,55%)] text-[hsl(var(--muted))]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Player
        </Button>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[hsl(var(--muted))]/50">
                <tr>
                  <th className="text-left p-4 font-medium">Player</th>
                  <th className="text-left p-4 font-medium">Position</th>
                  <th className="text-left p-4 font-medium">Email</th>
                  <th className="text-left p-4 font-medium">Country</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPlayers.map((player) => (
                  <tr
                    key={player.id}
                    className="border-t border-border hover:bg-[hsl(var(--muted))]/50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={player.imageUrl?.[0]}
                          alt={`${player.firstName} ${player.lastName}`}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium">
                            {player.firstName} {player.lastName}
                          </p>
                          <p className="text-sm text-[hsl(var(--muted-foreground))]">
                            Age {calculateAge(player.dob)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{player.position}</td>
                    <td className="p-4">{player.email}</td>
                    <td className="p-4">{player.country}</td>
                    <td className="p-4">
                      <Badge
                        variant={player.featured ? 'default' : 'secondary'}
                        className={player.featured ? 'bg-green-500 hover:bg-green-600' : ''}
                      >
                        {player.featured ? 'Featured' : 'Normal'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditPlayer(player)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePlayer(player.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <PlayerDialog
        open={playerDialogOpen}
        onOpenChange={(open) => {
          setPlayerDialogOpen(open);
          if (!open) setEditingPlayer(null);
        }}
        player={editingPlayer || undefined}
        onSave={handleAddOrUpdatePlayer}
      />
    </div>
  );
}
